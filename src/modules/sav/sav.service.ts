import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const SAV_API_BASE = process.env.SAV_API_BASE || 'https://api.sav.com/domains_api_v1';
const APIKEY = process.env.SAV_API_KEY || 'fqNKjEPVxod4VhZdtA4voDTQgmDLW5P41jCSRxnH';

const savHeaders = {
  headers: {
    APIKEY,
  },
};

@Injectable()
export class SavService {
  private readonly logger = new Logger(SavService.name);

  private handleError(error: any) {
    this.logger.error('[SAV API ERROR]', error?.message || error);
    throw new InternalServerErrorException(error?.message || 'Internal Server Error');
  }

  async getActiveDomains() {
    try {
      const res = await axios.get(`${SAV_API_BASE}/get_active_domains_in_account`, savHeaders);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async getRecentAuctionSales() {
    try {
      const res = await axios.get(`${SAV_API_BASE}/get_recent_auction_sales`, savHeaders);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async getRecentPremiumSales() {
    try {
      const res = await axios.get(`${SAV_API_BASE}/get_recent_premium_sales`, savHeaders);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async removeDomainForSale(domain_name: string) {
    try {
      const res = await axios.get(`${SAV_API_BASE}/remove_domain_for_sale?domain_name=${domain_name}`, savHeaders);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async submitAuthCode(domain_name: string, auth_code: string) {
    try {
      const res = await axios.get(`${SAV_API_BASE}/submit_auth_code_for_pending_transfer_in?domain_name=${domain_name}&auth_code=${auth_code}`, savHeaders);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async updateAutoRenewal(domain_name: string, enabled: boolean) {
    try {
      const res = await axios.get(`${SAV_API_BASE}/update_domain_auto_renewal?domain_name=${domain_name}&enabled=${enabled}`, savHeaders);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async updateDomainForSalePrice(domain_name: string, sale_price: number) {
    try {
      const res = await axios.get(`${SAV_API_BASE}/update_domain_for_sale_price?domain_name=${domain_name}&sale_price=${sale_price}`, savHeaders);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async updateDomainNameservers(domain_name: string, ns_1: string, ns_2: string) {
    try {
      const res = await axios.get(`${SAV_API_BASE}/update_domain_nameservers?domain_name=${domain_name}&ns_1=${ns_1}&ns_2=${ns_2}`, savHeaders);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async updateDomainPrivacy(domain_name: string, enabled: boolean) {
    try {
      const res = await axios.get(`${SAV_API_BASE}/update_domain_privacy?domain_name=${domain_name}&enabled=${enabled}`, savHeaders);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async updateDomainWhoisContacts(body: any) {
    const {
      domain_name, name, organization, email_address,
      street, city, country, phone, state, postal_code,
      update_registrant, update_tech, update_admin
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
      const res = await axios.get(url, savHeaders);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async listExternalDomainForSale(domain_name: string, sale_price: number) {
    try {
      const res = await axios.get(`${SAV_API_BASE}/list_external_domain_for_sale?domain_name=${domain_name}&sale_price=${sale_price}`, savHeaders);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async getDomainPricing() {
    try {
      const res = await axios.get(`${SAV_API_BASE}/get_domain_pricing`, savHeaders);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }
}
