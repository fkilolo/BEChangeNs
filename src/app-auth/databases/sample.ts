export const ADMIN_ROLE = "SUPER_ADMIN";
export const USER_ROLE = "NORMAL_USER";
export const EMAIL_ADMIN = "admin@gmail.com";
export const ROLE_TT_TP = "TT/TP";
export const ROLE_SEO = "SEO";
export const ROLE_TRO_LY_CHU_QUAN = "TRO_LY_CHU_QUAN";
//status order
export const DOMAIN_STATUS_CREATE = "DOMAIN MỚI";

//status order
export const ORDER_STATUS_SEO_CREATE = "SEO_CREATE_ORDER";
export const ORDER_STATUS_CREATE = "CREATE_ORDER";
export const ORDER_STATUS_DONE = "DONE_ORDER";
export const ORDER_STATUS_CANCEL = "CANCEL_ORDER";
export const ORDER_STATUS_ASYNC = "ASYNC_ORDER";

//type update domain
export const UPDATE_NAME_SERVER = "UPDATE_NAME_SERVER";

//code send telegram order
export const ORDER_SEND_TELEGRAM = "@thongBaoDonDomainOKVIP_bot";
export const ERROR_SEND_TELEGRAM = "@thongBaoErrorokvip_bot";
export const Expire_SEND_TELEGRAM = "@thongBaoExpireOkvip_bot";

//token market
export const TOKEN_MARKET =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NDIyNGQ5YjZlOTYyZGNhZGI2M2E3MmEiLCJpZCI6IjY0MjI0ZDliNmU5NjJkY2FkYjYzYTcyYSIsImlhdCI6MTczMTY0NDI3OX0.nK6XSFjRYskm8igW1BWkh4cf096zuyn3TwDMSHVi5JU";

export enum SupplierType {
  EPIK = "epik",
  DYNADOT = "dynadot",
  GNAME = "gname",
  ENOM = "enom",
  NAME = "name",
  GODADDY = "godaddy",
  NAMECHEAP = "namecheap",
}

export enum STATUS_DOMAIN_IN_CART {
  NEW_DOMAIN_ORDER = "Đề xuất mua",
  BUY_SUCCESS = "Mua thành công",
  ERROR_CONNECT = "Lỗi kết nối",
  NOT_AVAILABLE = "Domain không có sẵn",
  WALLET_OUT_OF_MONEY = "Ví tài khoản không đủ tiền",
  CANCEL_DOMAIN = "Hủy domain",
}

export enum LockStatus {
  LOCKED = "locked",
  UNLOCKED = "unlocked",
  RIGISTRAR_LOCKED = "registrar_locked",
}

export enum ExternalStatus {
  EXTERNAL = "external",
  INTERNAL = "internal",
}

export enum TypeHostRecord {
  A = "A",
  AAAA = "AAAA",
  CNAME = "CNAME",
  MX = "MX",
  NS = "NS",
  TXT = "TXT",
  SRV = "SRV",
  CAA = "CAA",
  ALIAS = "ALIAS",
  URI = "URI",
  SSHFP = "SSHFP",
  TLSA = "TLSA",
}

export enum Bank {
  BUSINESS_A = "00000000",
}

export enum TypeCloud {
  CLOUDFLARE = "Cloudflare",
  BUNNY = "bunny",
  OVH = "OVH",
  LINODE = "Linode",
}

export const INIT_PERMISSIONS = [
  //AUTH
  {
    name: "Chi tiết tài khoản",
    apiPath: "/api/v1/auth/account",
    method: "GET",
    module: "AUTH",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      user: "administrator",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T06:59:31.898Z",
    updatedAt: "2024-03-27T06:59:31.898Z",
    __v: 0,
  },
  {
    name: "Đăng xuất",
    apiPath: "/api/v1/auth/logout",
    method: "POST",
    module: "AUTH",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      user: "administrator",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T06:59:31.898Z",
    updatedAt: "2024-03-27T06:59:31.898Z",
    __v: 0,
  },
  //USERS
  {
    name: "Tạo tài khoản",
    apiPath: "/api/v1/users",
    method: "POST",
    module: "USERS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T06:59:31.898Z",
    updatedAt: "2024-03-27T06:59:31.898Z",
    __v: 0,
  },
  {
    name: "Cập nhật tài khoản",
    apiPath: "/api/v1/users/:id",
    method: "PATCH",
    module: "USERS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T07:00:41.934Z",
    updatedAt: "2024-03-27T07:00:41.934Z",
    __v: 0,
  },
  {
    name: "Chi tiết tài khoản",
    apiPath: "/api/v1/users/:id",
    method: "GET",
    module: "USERS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T06:59:51.041Z",
    updatedAt: "2024-03-27T06:59:51.041Z",
    __v: 0,
  },
  {
    name: "Danh sách tài khoản",
    apiPath: "/api/v1/users",
    method: "GET",
    module: "USERS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T07:00:13.364Z",
    updatedAt: "2024-03-27T07:00:13.364Z",
    __v: 0,
  },
  {
    name: "Xóa tài khoản",
    apiPath: "/api/v1/users/:id",
    method: "DELETE",
    module: "USERS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T07:00:56.274Z",
    updatedAt: "2024-03-27T07:00:56.274Z",
    __v: 0,
  },
  {
    name: "Đồng bộ tài khoản",
    apiPath: "/api/v1/users/getSynchronizeUser",
    method: "GET",
    module: "USERS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T07:00:56.274Z",
    updatedAt: "2024-03-27T07:00:56.274Z",
    __v: 0,
  },
  //PERMISSIONS
  {
    name: "Tạo vài trò",
    apiPath: "/api/v1/permissions",
    method: "POST",
    module: "PERMISSIONS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T09:10:50.946Z",
    updatedAt: "2024-03-27T09:10:50.946Z",
    __v: 0,
  },
  {
    name: "Cập nhật vài trò",
    apiPath: "/api/v1/permissions/:id",
    method: "PATCH",
    module: "PERMISSIONS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T09:11:48.081Z",
    updatedAt: "2024-03-27T09:11:48.081Z",
    __v: 0,
  },
  {
    name: "Danh sách vài trò",
    apiPath: "/api/v1/permissions",
    method: "GET",
    module: "PERMISSIONS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T09:11:10.914Z",
    updatedAt: "2024-03-27T09:11:10.914Z",
    __v: 0,
  },
  {
    name: "Chi tiết vài trò",
    apiPath: "/api/v1/permissions/:id",
    method: "GET",
    module: "PERMISSIONS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T09:11:33.234Z",
    updatedAt: "2024-03-27T09:11:33.234Z",
    __v: 0,
  },
  {
    name: "Xóa vài trò",
    apiPath: "/api/v1/permissions/:id",
    method: "DELETE",
    module: "PERMISSIONS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T09:12:11.323Z",
    updatedAt: "2024-03-27T09:12:11.323Z",
    __v: 0,
  },
  //ROLES
  {
    name: "Tạo phân quyền",
    apiPath: "/api/v1/roles",
    method: "POST",
    module: "ROLES",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T09:12:51.974Z",
    updatedAt: "2024-03-27T09:12:51.974Z",
    __v: 0,
  },
  {
    name: "Cập nhật phân quyền",
    apiPath: "/api/v1/roles/:id",
    method: "PATCH",
    module: "ROLES",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T09:13:36.836Z",
    updatedAt: "2024-03-27T09:13:36.836Z",
    __v: 0,
  },
  {
    name: "Chi tiết phân quyền",
    apiPath: "/api/v1/roles/:id",
    method: "GET",
    module: "ROLES",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T09:13:20.853Z",
    updatedAt: "2024-03-27T09:13:20.853Z",
    __v: 0,
  },
  {
    name: "Danh sách phân quyền",
    apiPath: "/api/v1/roles",
    method: "GET",
    module: "ROLES",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T09:13:06.618Z",
    updatedAt: "2024-03-27T09:13:06.618Z",
    __v: 0,
  },

  {
    name: "Xóa phân quyền",
    apiPath: "/api/v1/roles/:id",
    method: "DELETE",
    module: "ROLES",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T09:13:52.798Z",
    updatedAt: "2024-03-27T09:13:52.798Z",
    __v: 0,
  },
  //TEAMS
  {
    name: "Tạo team",
    apiPath: "/api/v1/teams",
    method: "POST",
    module: "TEAMS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T09:12:51.974Z",
    updatedAt: "2024-03-27T09:12:51.974Z",
    __v: 0,
  },
  {
    name: "Cập nhật team",
    apiPath: "/api/v1/teams/:id",
    method: "PATCH",
    module: "TEAMS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T09:13:36.836Z",
    updatedAt: "2024-03-27T09:13:36.836Z",
    __v: 0,
  },
  {
    name: "Chi tiết team",
    apiPath: "/api/v1/teams/:id",
    method: "GET",
    module: "TEAMS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T09:13:20.853Z",
    updatedAt: "2024-03-27T09:13:20.853Z",
    __v: 0,
  },
  {
    name: "Danh sách team",
    apiPath: "/api/v1/teams",
    method: "GET",
    module: "TEAMS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T09:13:06.618Z",
    updatedAt: "2024-03-27T09:13:06.618Z",
    __v: 0,
  },

  {
    name: "Xóa team",
    apiPath: "/api/v1/teams/:id",
    method: "DELETE",
    module: "TEAMS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T09:13:52.798Z",
    updatedAt: "2024-03-27T09:13:52.798Z",
    __v: 0,
  },
  {
    name: "Đồng bộ team",
    apiPath: "/api/v1/teams/getSynchronizeTeam",
    method: "GET",
    module: "TEAMS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T07:00:56.274Z",
    updatedAt: "2024-03-27T07:00:56.274Z",
    __v: 0,
  },
  //BRANDS
  {
    name: "Tạo thương hiệu",
    apiPath: "/api/v1/brands",
    method: "POST",
    module: "BRANDS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T09:12:51.974Z",
    updatedAt: "2024-03-27T09:12:51.974Z",
    __v: 0,
  },
  {
    name: "Cập nhật thương hiệu",
    apiPath: "/api/v1/brands/:id",
    method: "PATCH",
    module: "BRANDS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T09:13:36.836Z",
    updatedAt: "2024-03-27T09:13:36.836Z",
    __v: 0,
  },
  {
    name: "Chi tiết thương hiệu",
    apiPath: "/api/v1/brands/:id",
    method: "GET",
    module: "BRANDS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T09:13:20.853Z",
    updatedAt: "2024-03-27T09:13:20.853Z",
    __v: 0,
  },
  {
    name: "Danh sách thương hiệu",
    apiPath: "/api/v1/brands",
    method: "GET",
    module: "BRANDS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T09:13:06.618Z",
    updatedAt: "2024-03-27T09:13:06.618Z",
    __v: 0,
  },

  {
    name: "Xóa thương hiệu",
    apiPath: "/api/v1/brands/:id",
    method: "DELETE",
    module: "BRANDS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T09:13:52.798Z",
    updatedAt: "2024-03-27T09:13:52.798Z",
    __v: 0,
  },
  {
    name: "Đồng bộ thương hiệu",
    apiPath: "/api/v1/brands/getSynchronizeBrand",
    method: "GET",
    module: "BRANDS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T07:00:56.274Z",
    updatedAt: "2024-03-27T07:00:56.274Z",
    __v: 0,
  },
  //DOMAINS
  {
    name: "Tạo tên miền",
    apiPath: "/api/v1/domains",
    method: "POST",
    module: "DOMAINS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T09:12:51.974Z",
    updatedAt: "2024-03-27T09:12:51.974Z",
    __v: 0,
  },
  {
    name: "Cập nhật tên miền",
    apiPath: "/api/v1/domains/:id",
    method: "PATCH",
    module: "DOMAINS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T09:13:36.836Z",
    updatedAt: "2024-03-27T09:13:36.836Z",
    __v: 0,
  },
  {
    name: "Chi tiết tên miền",
    apiPath: "/api/v1/domains/:id",
    method: "GET",
    module: "DOMAINS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T09:13:20.853Z",
    updatedAt: "2024-03-27T09:13:20.853Z",
    __v: 0,
  },
  {
    name: "Danh sách tên miền",
    apiPath: "/api/v1/domains",
    method: "GET",
    module: "DOMAINS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T09:13:06.618Z",
    updatedAt: "2024-03-27T09:13:06.618Z",
    __v: 0,
  },

  {
    name: "Xóa tên miền",
    apiPath: "/api/v1/domains/:id",
    method: "DELETE",
    module: "DOMAINS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T09:13:52.798Z",
    updatedAt: "2024-03-27T09:13:52.798Z",
    __v: 0,
  },
  {
    name: "Đồng bộ thương hiệu",
    apiPath: "/api/v1/domains/getSynchronizeDomain",
    method: "GET",
    module: "DOMAINS",
    createdBy: {
      _id: "647b5108a8a243e8191855b5",
      email: "admin@gmail.com",
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-27T07:00:56.274Z",
    updatedAt: "2024-03-27T07:00:56.274Z",
    __v: 0,
  },
];
