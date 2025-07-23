import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Spaceship } from './schemas/spaceship.schema';
import { CreateSpaceshipDto } from './dto/create-spaceship.dto';
import { UpdateSpaceshipDto } from './dto/update-spaceship.dto';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { IUser } from '../users/users.interface';
dotenv.config();

const SPACESHIP_API_BASE = process.env.SPACESHIP_API_BASE || 'https://spaceship.dev/api/v1';

@Injectable()
export class SpaceshipService {
  constructor(
    @InjectModel(Spaceship.name) private readonly spaceshipModel: Model<Spaceship>,
  ) {}

  async create(createDto: CreateSpaceshipDto, user: IUser) {
    createDto.userName = user.userName;

    const existing = await this.spaceshipModel.findOne({ userName: createDto.userName });
    if (existing) {
      throw new BadRequestException('Tên kết nối Spaceship đã tồn tại');
    }

    return this.spaceshipModel.create(createDto);
  }

  async findAll(current = 1, pageSize = 10, search?: string) {
    const skip = (current - 1) * pageSize;
    const filter: any = {};
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    const [result, total] = await Promise.all([
      this.spaceshipModel.find(filter)
        .sort({ createdAt: -1 }) // Sắp xếp mới nhất đến cũ nhất
        .skip(skip)
        .limit(pageSize),
      this.spaceshipModel.countDocuments(filter)
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
    const doc = await this.spaceshipModel.findById(id);
    if (!doc) throw new NotFoundException('Spaceship not found');
    return doc;
  }

  async update(id: string, updateDto: UpdateSpaceshipDto) {
    const doc = await this.spaceshipModel.findByIdAndUpdate(id, updateDto, { new: true });
    if (!doc) throw new NotFoundException('Spaceship not found');
    return doc;
  }

  async remove(id: string) {
    const doc = await this.spaceshipModel.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException('Spaceship not found');
    return doc;
  }

  async getDomains(id: string, take?: number, skip?: number, orderBy?: string, search?: string) {
    // Lấy thông tin connect từ DB
    const connect = await this.spaceshipModel.findById(id);
    if (!connect) throw new NotFoundException('Spaceship connect not found');
    const apikey = connect.apikey;
    const secretkey = connect.secretkey;
    if (!apikey || !secretkey) throw new NotFoundException('Thiếu apikey hoặc secretkey');

    // Nếu có search, gọi getDomainDetail
    if (search) {
        const result = await this.getDomainDetail(id, search);
        return {
            items: [result],
            total: 1,
        }
    }

    // Gán mặc định
    take = take && take >= 1 && take <= 100 ? take : 20;
    skip = skip && skip >= 0 ? skip : 0;
    const params = [`take=${take}`, `skip=${skip}`];
    if (orderBy) params.push(`orderBy=${encodeURIComponent(orderBy)}`);
    const url = `${SPACESHIP_API_BASE}/domains?${params.join('&')}`;

    // Gọi API spaceship
    const headers = {
      'X-API-Key': apikey,
      'X-API-Secret': secretkey
    };
    try {
      const res = await axios.get(url, { headers });
      return res.data;
    } catch (err) {
      throw new NotFoundException(err?.response?.data?.message || 'Lỗi lấy domain từ spaceship');
    }
  }

  // gọi bất đồng bộ
  // async updateNameservers(body: {
  //   conect_id: string;
  //   provider: string;
  //   domain: string[];
  //   hosts: string[];
  // }) {
  //   const { conect_id, provider, domain, hosts } = body;
  //   // Lấy thông tin connect từ DB
  //   const connect = await this.spaceshipModel.findById(conect_id);
  //   if (!connect) throw new NotFoundException('Spaceship connect not found');
  //   const apikey = connect.apikey;
  //   const secretkey = connect.secretkey;
  //   if (!apikey || !secretkey) throw new NotFoundException('Thiếu apikey hoặc secretkey');

  //   // Validate input
  //   if (!Array.isArray(domain) || domain.length === 0) throw new NotFoundException('Danh sách domain không hợp lệ');
  //   if (!Array.isArray(hosts) || hosts.length === 0) throw new NotFoundException('Danh sách hosts không hợp lệ');
  //   if (!provider) throw new NotFoundException('Thiếu provider');

  //   // Gọi API update cho từng domain (bất đồng bộ)
  //   const headers = {
  //     'X-API-Key': apikey,
  //     'X-API-Secret': secretkey,
  //     'content-type': 'application/json'
  //   };
  //   const results = await Promise.all(domain.map(async (d) => {
  //     const url = `${SPACESHIP_API_BASE}/domains/${encodeURIComponent(d)}/nameservers`;
  //     try {
  //       const res = await axios.put(url, { provider, hosts }, { headers });
  //       return { domain: d, success: true, data: res.data };
  //     } catch (err) {
  //       return { domain: d, success: false, error: err?.response?.data?.message || err.message };
  //     }
  //   }));
  //   return results;
  // }

  async updateNameservers(body: {
    conect_id: string;
    provider: string;
    domain: string[];
    hosts: string[];
  }) {
    const { conect_id, provider, domain, hosts } = body;
    // Lấy thông tin connect từ DB
    const connect = await this.spaceshipModel.findById(conect_id);
    if (!connect) throw new NotFoundException('Spaceship connect not found');
    const apikey = connect.apikey;
    const secretkey = connect.secretkey;
    if (!apikey || !secretkey) throw new NotFoundException('Thiếu apikey hoặc secretkey');

    // Validate input
    if (!Array.isArray(domain) || domain.length === 0) throw new NotFoundException('Danh sách domain không hợp lệ');
    if (!Array.isArray(hosts) || hosts.length === 0) throw new NotFoundException('Danh sách hosts không hợp lệ');
    if (!provider) throw new NotFoundException('Thiếu provider');

    // Gọi API update cho từng domain (tuần tự)
    const headers = {
      'X-API-Key': apikey,
      'X-API-Secret': secretkey,
      'content-type': 'application/json'
    };
    const results = [];
    for (const d of domain) {
      const url = `${SPACESHIP_API_BASE}/domains/${encodeURIComponent(d)}/nameservers`;
      try {
        const res = await axios.put(url, { provider, hosts }, { headers });
        results.push({ domain: d, success: true, data: res.data });
      } catch (err) {
        results.push({ domain: d, success: false, error: err?.response?.data?.message || err.message });
      }
    }
    return results;
  }

  async updateAllNameservers(body: {
    conect_id: string;
    provider: string;
    hosts: string[];
  }) {
    const { conect_id, provider, hosts } = body;
    // Lấy thông tin connect từ DB
    const connect = await this.spaceshipModel.findById(conect_id);
    if (!connect) throw new NotFoundException('Spaceship connect not found');
    const apikey = connect.apikey;
    const secretkey = connect.secretkey;
    if (!apikey || !secretkey) throw new NotFoundException('Thiếu apikey hoặc secretkey');
    if (!provider) throw new NotFoundException('Thiếu provider');
    if (!Array.isArray(hosts) || hosts.length === 0) throw new NotFoundException('Danh sách hosts không hợp lệ');

    // Gọi API lấy all domain
    const headers = {
      'X-API-Key': apikey,
      'X-API-Secret': secretkey
    };
    let domains: string[] = [];
    try {
      const orderBy = 'name';
      const res = await axios.get(`${SPACESHIP_API_BASE}/domains?take=100&skip=0&orderBy=${orderBy}`, { headers });
      if (Array.isArray(res.data.items)) {
        domains = res.data.items.map((item: any) => item.name).filter(Boolean);
      }
    } catch (err) {
      throw new NotFoundException('Không lấy được danh sách domain từ spaceship');
    }
    if (!domains.length) throw new NotFoundException('Không có domain nào để cập nhật');

    // Gọi update nameserver cho toàn bộ domain (bất đồng bộ)
    const updateBody = {
      conect_id,
      provider,
      domain: domains,
      hosts
    };
    return this.updateNameservers(updateBody);
  }

  async getDomainDetail(conect_id: string, domain: string) {
    // Lấy thông tin connect từ DB
    const connect = await this.spaceshipModel.findById(conect_id);
    if (!connect) throw new NotFoundException('Spaceship connect not found');
    const apikey = connect.apikey;
    const secretkey = connect.secretkey;
    if (!apikey || !secretkey) throw new NotFoundException('Thiếu apikey hoặc secretkey');

    // Gọi API lấy chi tiết domain
    const headers = {
      'X-API-Key': apikey,
      'X-API-Secret': secretkey
    };
    try {
      const url = `${SPACESHIP_API_BASE}/domains/${encodeURIComponent(domain)}`;
      const res = await axios.get(url, { headers });
      return res.data;
    } catch (err) {
      throw new NotFoundException(err?.response?.data?.message || 'Không lấy được chi tiết domain từ spaceship');
    }
  }
} 