import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import axios from 'axios';
import * as aqp from 'api-query-params';
import { CreateGodadyDto } from './dto/create-godady.dto';
import { UpdateGodadyDto } from './dto/update-godady.dto';
import { IUser } from '../users/users.interface';
import { Godady, GodadyDocument } from './schemas/godady.schemas';

const GODADDY_API_BASE = 'https://api.godaddy.com/v1';

@Injectable()
export class GodadyService {
  private readonly logger = new Logger(GodadyService.name);

  constructor(
    @InjectModel(Godady.name)
    private readonly godadyModel: Model<GodadyDocument>,
  ) {}

  private async getAuthHeadersByUser(user: IUser) {
    const userName = user?.userName;
    if (!userName) throw new BadRequestException('User không hợp lệ');

    const account = await this.godadyModel.findOne({ userName });
    if (!account || !account.apikey || !account.secretkey) {
      throw new BadRequestException('Tài khoản GoDaddy chưa cấu hình apikey/secretkey');
    }

    return {
      headers: {
        Authorization: `sso-key ${account.apikey}:${account.secretkey}`,
        'Content-Type': 'application/json',
      },
    };
  }

  async create(createDto: CreateGodadyDto, user: IUser) {
    createDto.userName = user.userName;

    const existing = await this.godadyModel.findOne({ userName: createDto.userName });
    if (existing) throw new BadRequestException('Tài khoản GoDaddy đã tồn tại');

    const doc = new this.godadyModel({ ...createDto, createdBy: user._id });
    return doc.save();
  }

  async findAll(current: number, pageSize: number, qs: string, user: IUser) {
    const { filter = {}, sort, population } = aqp.default(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (current - 1) * pageSize;
    const totalItems = await this.godadyModel.countDocuments(filter);
    const result = await this.godadyModel
      .find(filter)
      .skip(offset)
      .limit(pageSize)
      .sort(sort as any)
      .populate(population)
      .lean();

    return {
      meta: {
        current,
        pageSize,
        pages: Math.ceil(totalItems / pageSize),
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.godadyModel.findById(id).lean();
  }

  async update(id: string, dto: UpdateGodadyDto) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('ID không hợp lệ');
    return this.godadyModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('ID không hợp lệ');
    return this.godadyModel.deleteOne({ _id: id });
  }

  async getDomains(user: IUser) {
    try {
      const headers = await this.getAuthHeadersByUser(user);
      const res = await axios.get(`${GODADDY_API_BASE}/domains`, headers);
      return res.data;
    } catch (err) {
      this.logger.error('[GODADDY ERROR]', err?.message || err);
      throw new InternalServerErrorException('Lỗi khi lấy danh sách domain');
    }
  }

  async updateDomainNameserver(domain: string, ns1: string, ns2: string, user: IUser) {
    try {
      const headers = await this.getAuthHeadersByUser(user);
      const body = { nameservers: [ns1, ns2] };
      const res = await axios.put(`${GODADDY_API_BASE}/domains/${domain}/nameservers`, body, headers);
      return res.data || { success: true };
    } catch (err) {
      this.logger.error(`[NS ERROR] ${domain}`, err?.message || err);
      throw new InternalServerErrorException(`Lỗi khi cập nhật nameserver cho ${domain}`);
    }
  }

  async updateDomainNameserversBulk(domains: string[], ns1: string, ns2: string, user: IUser) {
    if (!domains.length) throw new BadRequestException('Danh sách domain không được rỗng');
    const headers = await this.getAuthHeadersByUser(user);

    const results = await Promise.allSettled(
      domains.map((domain) =>
        axios.put(
          `${GODADDY_API_BASE}/domains/${domain}/nameservers`,
          { nameservers: [ns1, ns2] },
          headers,
        ),
      ),
    );

    return results.map((res, idx) => ({
      domain: domains[idx],
      success: res.status === 'fulfilled',
      data: res.status === 'fulfilled' ? res.value.data : null,
      error: res.status === 'rejected' ? res.reason?.message : null,
    }));
  }
}
