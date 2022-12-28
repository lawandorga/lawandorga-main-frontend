export interface IMailDomain {
  uuid: string;
  name: string;
  is_active: boolean;
}

export interface IAvailableMailDomain {
  uuid: string;
  name: string;
}

export interface IMailGroup {
  uuid: string;
  email: string | null;
}

export interface IMailUser {
  name: string;
  uuid: string;
  email: string | null;
}
export interface IMailAddress {
  uuid: string;
  is_default: boolean;
  localpart: string;
  domain: IMailDomain;
}

interface ISelfMailAccount {
  addresses: IMailAddress[];
}

interface ISelfGroup {
  email: string | null;
}

export interface ISelfMailUser {
  email: string | null;
  uuid: string | null;
  account: ISelfMailAccount;
  aliases: string[];
  groups: ISelfGroup[];
}

export interface NoMailAccount {
  noMailAccount: true;
}

export interface MailDashboardPage {
  user: ISelfMailUser;
  available_domains: IAvailableMailDomain[];
  domain: IMailDomain;
  noMailAccount: false;
  users: IMailUser[];
  groups: IMailGroup[];
}

export interface IMailGroupPage {
  available_domains: IMailDomain[];
  addresses: IMailAddress[];
  members: IMailUser[];
  available_users: IMailUser[];
}

export interface IMailUserPage {
  available_domains: IMailDomain[];
  addresses: IMailAddress[];
}

export interface IMailCheckDomain {
  valid: boolean;
  wrong_setting: string | null;
}
