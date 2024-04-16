export interface MailDomain {
  uuid: string;
  name: string;
  is_active: boolean;
}

export interface AvailableMailDomain {
  uuid: string;
  name: string;
}

export interface MailGroup {
  uuid: string;
  email: string | null;
}

export interface MailUser {
  name: string;
  uuid: string;
  email: string | null;
}

export interface MailAddress {
  uuid: string;
  is_default: boolean;
  localpart: string;
  domain: MailDomain;
}

interface SelfMailAccount {
  addresses: MailAddress[];
}

interface SelfGroup {
  email: string | null;
}

export interface SelfMailUser {
  email: string | null;
  uuid: string | null;
  account: SelfMailAccount;
  aliases: string[];
  groups: SelfGroup[];
}

export interface NoMailAccount {
  noMailAccount: true;
}

export interface MailDashboardPage {
  user: SelfMailUser;
  available_domains: AvailableMailDomain[];
  domain: MailDomain;
  noMailAccount: false;
  users: MailUser[];
  groups: MailGroup[];
}

export interface MailGroupPage {
  available_domains: MailDomain[];
  addresses: MailAddress[];
  members: MailUser[];
  available_users: MailUser[];
}

export interface MailUserPage {
  available_domains: MailDomain[];
  addresses: MailAddress[];
}

export interface MailCheckDomain {
  valid: boolean;
  wrong_setting: string | null;
}
