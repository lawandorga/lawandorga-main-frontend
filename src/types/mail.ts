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

interface MailDomain {
  id: string;
  name: string;
}

export interface MailPageMail {
  user: MailUser;
  available_domains: MailDomain;
}

export interface NoMailAccount {
  no_mail_account: true;
}
