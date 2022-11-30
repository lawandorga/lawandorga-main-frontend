export interface MailAddress {
  localpart: string;
}

interface MailAccount {
  addresses: MailAddress[];
}

export interface ISelfMailUser {
  email: string | null;
  uuid: string | null;
  account: MailAccount;
  aliases: string[];
}

export interface IMailDomain {
  uuid: string;
  name: string;
}

export interface IMailGroup {
  uuid: string;
  email: string;
}

export interface IMailUser {
  uuid: string;
  email: string;
}

export interface MailDashboardPage {
  user: ISelfMailUser;
  available_domains: IMailDomain[];
  domain: IMailDomain;
  noMailAccount: false;
  users: IMailUser[];
  groups: IMailGroup[];
}

export interface NoMailAccount {
  noMailAccount: true;
}

export interface IMailAddress {
  uuid: string;
  is_default: boolean;
  localpart: string;
  domain: IMailDomain;
}

export interface IMailGroupPage {
  available_domains: IMailDomain[];
  addresses: IMailAddress[];
}

export interface IMailUserPage {
  available_domains: IMailDomain[];
  addresses: IMailAddress[];
}
