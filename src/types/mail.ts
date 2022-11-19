export interface MailAddress {
  localpart: string;
}

interface MailAccount {
  addresses: MailAddress[];
}

export interface MailUser {
  email: string | null;
  id: string | null;
  account: MailAccount;
  aliases: string[];
}

export interface MailDomain {
  id: string;
  name: string;
}

export interface MailDashboardPage {
  user: MailUser;
  available_domains: MailDomain;
  domain: MailDomain;
  noMailAccount: false;
}

export interface NoMailAccount {
  noMailAccount: true;
}
