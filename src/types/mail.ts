export interface MailAddress {
  localpart: string;
}

interface MailAddressWithUser {
  localpart: string;
  domain: { name: string };
  user: { name: string };
}

interface MailAccount {
  addresses: MailAddress[];
}

export interface MailUser {
  email: string | null;
  uuid: string | null;
  account: MailAccount;
  aliases: string[];
}

export interface MailDomain {
  uuid: string;
  name: string;
}

export interface MailDashboardPage {
  user: MailUser;
  available_domains: MailDomain[];
  domain: MailDomain;
  noMailAccount: false;
  addresses: MailAddressWithUser[];
}

export interface NoMailAccount {
  noMailAccount: true;
}
