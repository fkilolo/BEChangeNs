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
import { CreateEpikDto } from './dto/create-epik.dto';
import { UpdateEpikDto } from './dto/update-epik.dto';
import { Epik, EpikDocument } from './schemas/epik.schemas';
import { IUser } from '../users/users.interface';

const EPIK_API_BASE = 'https://usersapiv2.epik.com/v2';

@Injectable()
export class EpikService {
  private readonly logger = new Logger(EpikService.name);

  constructor(
    @InjectModel(Epik.name)
    private readonly epikModel: Model<EpikDocument>,
  ) {}


  async create(createDto: CreateEpikDto, user: IUser) {

    const existing = await this.epikModel.findOne({ userName: createDto.userName });
    if (existing) throw new BadRequestException('Tài khoản Epik đã tồn tại');

    const doc = new this.epikModel({ ...createDto, createdBy: user._id });
    return doc.save();
  }

  async findAll(current: number, pageSize: number, qs: string, user: IUser) {
    const { filter = {}, sort, population } = aqp.default(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (current - 1) * pageSize;
    const totalItems = await this.epikModel.countDocuments(filter);
    const result = await this.epikModel
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
    return this.epikModel.findById(id).lean();
  }

  async update(id: string, dto: UpdateEpikDto) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('ID không hợp lệ');
    return this.epikModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('ID không hợp lệ');
    return this.epikModel.deleteOne({ _id: id });
  }

  async getDomains(id: string, user: IUser) {
    const connect = await this.epikModel.findById(id);
    if (!connect) throw new NotFoundException('Epik connect not found');
    const signature = connect.signature;

    if (!signature) {
      throw new BadRequestException('Thiếu chữ ký signature');
    }
    try {
      const url = `${EPIK_API_BASE}/domains?SIGNATURE=${signature}`;
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      this.logger.error('[EPIK ERROR]', err?.message || err);
      throw new InternalServerErrorException('Lỗi khi lấy danh sách domain từ Epik');
    }
  }

  async updateNameserver(id: string, domain: string, ns1: string, ns2: string, user: IUser) {
    try {
      const connect = await this.epikModel.findById(id);
      if (!connect) throw new NotFoundException('Epik connect not found');
      const signature = connect.signature;
  
      if (!signature) {
        throw new BadRequestException('Thiếu chữ ký signature');
      }
      const url = `${EPIK_API_BASE}/domains/${domain}/name_servers?SIGNATURE=${signature}`;
      const body = {
        nses: { ns1, ns2 },
      };
      const res = await axios.put(url, body, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      return res.data || { success: true };
    } catch (err) {
      this.logger.error(`[EPIK NS ERROR] ${domain}`, err?.message || err);
      throw new InternalServerErrorException(`Lỗi khi cập nhật nameserver cho ${domain}`);
    }
  }

  async updateNameserversBulk(id: string, domains: string[], ns1: string, ns2: string, user: IUser) {
    if (!domains.length) throw new BadRequestException('Danh sách domain không được rỗng');
    const connect = await this.epikModel.findById(id);
    if (!connect) throw new NotFoundException('Epik connect not found');
    const signature = connect.signature;

    if (!signature) {
      throw new BadRequestException('Thiếu chữ ký signature');
    }

    const results = await Promise.allSettled(
      domains.map((domain) => {
        const url = `${EPIK_API_BASE}/domains/${domain}/name_servers?SIGNATURE=${signature}`;
        return axios.put(
          url,
          { nses: { ns1, ns2 } },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        );
      }),
    );

    return results.map((res, idx) => ({
      domain: domains[idx],
      success: res.status === 'fulfilled',
      data: res.status === 'fulfilled' ? res.value.data : null,
      error: res.status === 'rejected' ? res.reason?.message : null,
    }));
  }
  async getDomainInfo(id: string, domain: string, user: IUser) {
    try {
      const connect = await this.epikModel.findById(id);
      if (!connect) throw new NotFoundException('Epik connect not found');
      const signature = connect.signature;
  
      if (!signature) {
        throw new BadRequestException('Thiếu chữ ký signature');
      }
      const url = `${EPIK_API_BASE}/domains/${domain}/info?SIGNATURE=${signature}`;
      const res = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      return res.data;
    } catch (err) {
      this.logger.error(`[EPIK DOMAIN INFO ERROR] ${domain}`, err?.message || err);
      throw new InternalServerErrorException(`Lỗi khi lấy thông tin domain ${domain}`);
    }
  }
  
}
