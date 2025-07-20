export interface IUser {
  _id: string;
  userName: string;
  userBusinessId: string;
  role: {
    _id: string;
    name: string;
  };
  permissions: {
    _id: string;
    name: string;
    apiPath: string;
    module: string;
  }[];
  team: {
    _id: string;
    name: string;
  };
  teams: [
    {
      _id: string;
      name: string;
    },
  ];
}
