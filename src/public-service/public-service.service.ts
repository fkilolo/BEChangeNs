import { HttpService } from "@nestjs/axios";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { COUNTRY } from "src/app-auth/databases/dataCounty/country";

@Injectable()
export class PublicServiceService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService
  ) {}

  Crypt = (salt: string, text: string) => {
    const textToChars = (text: string) =>
      text.split("").map((c) => c.charCodeAt(0));
    const byteHex = (n: any) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code: any) =>
      textToChars(salt).reduce((a, b) => a ^ b, code);

    return text
      .split("")
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join("");
  };

  Decrypt = (salt: string, encoded: string) => {
    const textToChars = (text: string) =>
      text.split("").map((c) => c.charCodeAt(0));
    const applySaltToChar = (code: any) =>
      textToChars(salt).reduce((a, b) => a ^ b, code);
    return encoded
      .match(/.{1,2}/g)
      .map((hex) => parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode) => String.fromCharCode(charCode))
      .join("");
  };

  async GetTokenBusiness() {
    const salt = this.configService.get<string>("SALT_BUSINESS");
    const account = this.configService.get<string>("ACCOUNT");
    const account_password = this.configService.get<string>("ACCOUNT_PASSWORD");

    const decryptAccount = this.Decrypt(salt, account);
    const decryptOPassword = this.Decrypt(salt, account_password);

    let config = {
      method: "POST",
      url: `${this.configService.get<string>("URL_BUSINESS")}/auth/login`,
      headers: {
        referer: this.configService.get<string>("CLIENT_DEV_URL"),
      },
      data: {
        password: decryptOPassword,
        username: decryptAccount,
      },
    };

    try {
      const response = await this.httpService.axiosRef.request(config);
      if (response.statusText === "OK") {
        if (!response.data.data.jwtToken) return "";
        return response.data.data.jwtToken;
      }
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async getWhoIsDomain(domain: string) {
    let config = {
      method: "GET",
      url: `${this.configService.get<string>("URL_WHO_IS")}/${domain}`,
    };

    try {
      const response = await this.httpService.axiosRef.request(config);
      if (response.statusText === "OK") {
        if (!response.data) return "";
        return response.data;
      }
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  splitLocation(location: string): {
    city: string;
    countryCode: string;
    countryName: string;
  } {
    const parts = location.split(",");
    if (parts.length < 2) {
      throw new Error("Invalid location format");
    }
    let country = parts.pop().trim()!;
    const city = parts.join(".");
    if (country) {
      const fullCountry = COUNTRY.find((item) => item.name === country);
      return {
        city,
        countryCode: fullCountry?.code,
        countryName: fullCountry?.name,
      };
    }
  }

  async getDNSDomain(domain: string) {
    const APIKeyViewDNS = this.configService.get<string>("API_KEY_VIEW_DNS");
    let config = {
      method: "GET",
      url: `${this.configService.get<string>("URL_VIEW_DNS")}/propagation/?domain=${domain}&apikey=${APIKeyViewDNS}&output=json`,
    };

    try {
      const res = (await this.httpService.axiosRef.request(config)) as any;
      if (
        res?.data?.response?.server &&
        res?.data?.response?.server.length > 0
      ) {
        let data: Array<[string, any, any]> = [
          [
            "Country",
            "Trạng thái check",
            { role: "tooltip", type: "string", p: { html: true } },
          ],
        ];

        res?.data?.response?.server.forEach((item) => {
          const country = this.splitLocation(item.location);
          data.push([
            country.countryCode,
            700,
            `<div>Country:<b>${country.countryName}</b><br/>IP:<b>${item?.resultvalue}</b></div>`,
          ]);
        });
        return data;
      }
      return [];
    } catch (error) {
      if (error?.message === "Request failed with status code 403") {
        throw new BadRequestException(
          `Không thể check DNS domain ${domain}, vui lòng kiểm tra lại!`
        );
      }
      throw new BadRequestException(error?.message);
    }
  }
}
