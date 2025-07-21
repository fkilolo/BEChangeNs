import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { CreateSavDto } from './dto/create-sav.dto';
import { IUser } from '../users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Sav, SavDocument } from './schemas/sav.schemas';
import { Model, Types } from 'mongoose';
import { UpdateSavDto } from './dto/update-sav.dto';

dotenv.config();

const SAV_API_BASE = process.env.SAV_API_BASE || 'https://api.sav.com/domains_api_v1';

@Injectable()
export class SavService {
  private readonly logger = new Logger(SavService.name);
  constructor(
    @InjectModel(Sav.name)
    private readonly savModel: Model<SavDocument>,
  ) {}

  private handleError(error: any) {
    this.logger.error('[SAV API ERROR]', error?.message || error);
    throw new InternalServerErrorException(error?.message || 'Internal Server Error');
  }

  private async getHeaderByUser(user: IUser) {
  
    const userName = user?.userName;
    if (!userName) throw new BadRequestException('User không hợp lệ hoặc chưa đăng nhập');
  
    const account = await this.savModel.findOne({ userName });
    if (!account || !account.apikey) {
      throw new BadRequestException('Tài khoản SAV không tồn tại hoặc chưa cấu hình apikey');
    }
  
    return {
      headers: {
        APIKEY: account.apikey,
      },
    };
  }
  

  async findAll() {
    return this.savModel.find().sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.savModel.findById(id).lean();
  }

  async update(id: string, updateSavDto: UpdateSavDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID không hợp lệ');
    }

    return this.savModel.findByIdAndUpdate(id, updateSavDto, { new: true });
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID không hợp lệ');
    }

    return this.savModel.deleteOne({ _id: id });
  }

  async create(createSavDto: CreateSavDto, user: IUser) {
    createSavDto.userName = user.userName;

    const existing = await this.savModel.findOne({ userName: createSavDto.userName });
    if (existing) {
      throw new BadRequestException('Tên kết nối Sav đã tồn tại');
    }

    const sav = new this.savModel({
      ...createSavDto,
      createdBy: user._id,
    });

    return sav.save();
  }

  async getActiveDomains(user: IUser) {
    try {
      const headers = await this.getHeaderByUser(user);
      const res = await axios.get(`${SAV_API_BASE}/get_active_domains_in_account`, headers);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async getRecentAuctionSales(user: IUser) {
    try {
      const headers = await this.getHeaderByUser(user);
      const res = await axios.get(`${SAV_API_BASE}/get_recent_auction_sales`, headers);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async getRecentPremiumSales(user: IUser) {
    try {
      const headers = await this.getHeaderByUser(user);
      const res = await axios.get(`${SAV_API_BASE}/get_recent_premium_sales`, headers);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async removeDomainForSale(domain_name: string, user: IUser) {
    try {
      const headers = await this.getHeaderByUser(user);
      const res = await axios.get(`${SAV_API_BASE}/remove_domain_for_sale?domain_name=${domain_name}`, headers);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async submitAuthCode(domain_name: string, auth_code: string, user: IUser) {
    try {
      const headers = await this.getHeaderByUser(user);
      const res = await axios.get(`${SAV_API_BASE}/submit_auth_code_for_pending_transfer_in?domain_name=${domain_name}&auth_code=${auth_code}`, headers);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async updateAutoRenewal(domain_name: string, enabled: boolean, user: IUser) {
    try {
      const headers = await this.getHeaderByUser(user);
      const res = await axios.get(`${SAV_API_BASE}/update_domain_auto_renewal?domain_name=${domain_name}&enabled=${enabled}`, headers);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async updateDomainForSalePrice(domain_name: string, sale_price: number, user: IUser) {
    try {
      const headers = await this.getHeaderByUser(user);
      const res = await axios.get(`${SAV_API_BASE}/update_domain_for_sale_price?domain_name=${domain_name}&sale_price=${sale_price}`, headers);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async updateDomainNameservers(domain_name: string, ns_1: string, ns_2: string, user: IUser) {
    try {
      const headers = await this.getHeaderByUser(user);
      const res = await axios.get(`${SAV_API_BASE}/update_domain_nameservers?domain_name=${domain_name}&ns_1=${ns_1}&ns_2=${ns_2}`, headers);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async updateDomainPrivacy(domain_name: string, enabled: boolean, user: IUser) {
    try {
      const headers = await this.getHeaderByUser(user);
      const res = await axios.get(`${SAV_API_BASE}/update_domain_privacy?domain_name=${domain_name}&enabled=${enabled}`, headers);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async updateDomainWhoisContacts(body: any, user: IUser) {
    const {
      domain_name, name, organization, email_address,
      street, city, country, phone, state, postal_code,
      update_registrant, update_tech, update_admin,
    } = body;

    if (!domain_name || !name || !email_address || !street || !city || !country || !phone || !state || !postal_code) {
      throw new InternalServerErrorException('Missing required WHOIS fields.');
    }

    const url = `${SAV_API_BASE}/update_domain_whois_contacts?` +
      `domain_name=${domain_name}&name=${name}&organization=${organization}&email_address=${email_address}` +
      `&street=${street}&city=${city}&country=${country}&phone=${phone}` +
      `&state=${state}&postal_code=${postal_code}&update_registrant=${update_registrant}` +
      `&update_tech=${update_tech}&update_admin=${update_admin}`;

    try {
      const headers = await this.getHeaderByUser(user);
      const res = await axios.get(url, headers);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async listExternalDomainForSale(domain_name: string, sale_price: number, user: IUser) {
    try {
      const headers = await this.getHeaderByUser(user);
      const res = await axios.get(`${SAV_API_BASE}/list_external_domain_for_sale?domain_name=${domain_name}&sale_price=${sale_price}`, headers);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async getDomainPricing(user: IUser) {
    try {
      const headers = await this.getHeaderByUser(user);
      const res = await axios.get(`${SAV_API_BASE}/get_domain_pricing`, headers);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }
}
