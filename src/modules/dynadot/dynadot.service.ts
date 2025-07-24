import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dynadot } from './schemas/dynadot.schema';
import { CreateDynadotDto } from './dto/create-dynadot.dto';
import { UpdateDynadotDto } from './dto/update-dynadot.dto';
import { IUser } from '../users/users.interface';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const DYNADOT_API_BASE = process.env.DYNADOT_API_BASE || 'https://api-sandbox.dynadot.com/restful/v1';

@Injectable()
export class DynadotService {
  constructor(
    @InjectModel(Dynadot.name) private readonly dynadotModel: Model<Dynadot>,
  ) {}

  async create(createDto: CreateDynadotDto, user: IUser) {
    if (!createDto.userName || createDto.userName.trim() === '') {
      createDto.userName = user.userName;
    }
    return this.dynadotModel.create(createDto);
  }

  async findAll(current = 1, pageSize = 10, search?: string) {
    const skip = (current - 1) * pageSize;
    const filter: any = {};
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    const [result, total] = await Promise.all([
      this.dynadotModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),
      this.dynadotModel.countDocuments(filter)
    ]);
    return {
      meta: {
        current,
        pageSize,
        pages: Math.ceil(total / pageSize),
        total
      },
      result
    };
  }

  async findOne(id: string) {
    const doc = await this.dynadotModel.findById(id);
    if (!doc) throw new NotFoundException('Dynadot not found');
    return doc;
  }

  async update(id: string, updateDto: any) {
    if (updateDto.userName === '') {
      delete updateDto.userName;
    }
    const doc = await this.dynadotModel.findByIdAndUpdate(id, updateDto, { new: true });
    if (!doc) throw new NotFoundException('Dynadot not found');
    return doc;
  }

  async remove(id: string) {
    const doc = await this.dynadotModel.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException('Dynadot not found');
    return doc;
  }

  async getDomains(id: string, take?: number, skip?: number, orderBy?: string, search?: string) {
    // Lấy thông tin connect từ DB
    const connect = await this.dynadotModel.findById(id);
    if (!connect) throw new NotFoundException('Dynadot connect not found');
    const apikey = connect.apikey;
    if (!apikey) throw new NotFoundException('Thiếu apikey');

    // Xử lý query param cho Dynadot
    if (search) {
      const detail = await this.getDomainDetail(id, search);
      let domainInfoItem = detail;
      // Nếu detail trả về {code, message, data: {domainInfo: [...]}} thì lấy domainInfo[0]
      if (detail && detail.data && Array.isArray(detail.data.domainInfo)) {
        domainInfoItem = detail.data.domainInfo[0];
      }
      return {
        code: '200',
        message: 'Success',
        data: {
          domainInfo: domainInfoItem ? [domainInfoItem] : []
        }
      };
    }
    const params: any = {};
    if (typeof take === 'number' && take > 0) params.count_per_page = take;
    if (typeof skip === 'number' && skip >= 0) params.page_index = Math.floor((skip / (take || 10)) + 1);
    if (orderBy) params.sort = orderBy;
    // search không hỗ trợ trực tiếp, nếu cần thì filter sau khi lấy về

    const url = `${DYNADOT_API_BASE}/domains`;
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${apikey}`
    };
    try {
      const res = await axios.get(url, { headers, params });
      return res.data;
    } catch (err) {
      throw new NotFoundException(err?.response?.data?.message || 'Lỗi lấy domain từ dynadot');
    }
  }

  async getDomainDetail(id: string, domain: string) {
    // Lấy thông tin connect từ DB
    const connect = await this.dynadotModel.findById(id);
    if (!connect) throw new NotFoundException('Dynadot connect not found');
    const apikey = connect.apikey;
    if (!apikey) throw new NotFoundException('Thiếu apikey');

    // Dùng base production nếu cần, mặc định lấy từ ENV
    const url = `${DYNADOT_API_BASE}/domains/${encodeURIComponent(domain)}`;
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${apikey}`
    };
    try {
      const res = await axios.get(url, { headers });
      return res.data;
    } catch (err) {
      throw new NotFoundException(err?.response?.data?.message || 'Lỗi lấy chi tiết domain dynadot');
    }
  }

  async updateNameservers(body: {
    conect_id: string;
    domain: string[];
    hosts: string[];
  }) {
    const { conect_id, domain, hosts } = body;
    // Lấy thông tin connect từ DB
    const connect = await this.dynadotModel.findById(conect_id);
    if (!connect) throw new NotFoundException('Dynadot connect not found');
    const apikey = connect.apikey;
    const secretkey = connect.secretkey;
    if (!apikey || !secretkey) throw new NotFoundException('Thiếu apikey hoặc secretkey');

    // Validate input
    if (!Array.isArray(domain) || domain.length === 0) throw new NotFoundException('Danh sách domain không hợp lệ');
    if (!Array.isArray(hosts) || hosts.length === 0) throw new NotFoundException('Danh sách hosts không hợp lệ');

    // Gọi API update cho từng domain (tuần tự)
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apikey}`,
      'X-Signature': secretkey
    };
    const results = [];
    for (const d of domain) {
      const url = `${DYNADOT_API_BASE}/domains/${encodeURIComponent(d)}/nameservers`;
      try {
        const res = await axios.put(url, { nameserver_list: hosts }, { headers });
        results.push({ domain: d, success: true, data: res.data });
      } catch (err) {
        results.push({ domain: d, success: false, error: err?.response?.data?.message || err.message });
      }
    }
    return results;
  }

  async updateAllNameservers(body: {
    conect_id: string;
    hosts: string[];
  }) {
    const { conect_id, hosts } = body;
    // Lấy thông tin connect từ DB
    const connect = await this.dynadotModel.findById(conect_id);
    if (!connect) throw new NotFoundException('Dynadot connect not found');
    const apikey = connect.apikey;
    const secretkey = connect.secretkey;
    if (!apikey || !secretkey) throw new NotFoundException('Thiếu apikey hoặc secretkey');

    // Lấy tất cả domain
    const url = `${DYNADOT_API_BASE}/domains`;
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${apikey}`
    };
    let domains: string[] = [];
    try {
      const res = await axios.get(url, { headers });
      if (Array.isArray(res.data?.data?.domainInfo)) {
        domains = res.data.data.domainInfo.map((item: any) => item.domainName).filter(Boolean);
      }
    } catch (err) {
      throw new NotFoundException('Không lấy được danh sách domain từ dynadot');
    }
    if (!domains.length) throw new NotFoundException('Không có domain nào để cập nhật');

    // Gọi update nameserver cho toàn bộ domain (tuần tự)
    const updateBody = {
      conect_id,
      domain: domains,
      hosts
    };
    return this.updateNameservers(updateBody);
  }
} 