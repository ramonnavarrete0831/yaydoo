import { Permission } from '../entities/permission.entity';

export function validatePermission(permissions:Permission[], key:string): boolean {
  for (let index = 0; index < permissions.length; index++) {
    const permission = permissions[index];
    if(permission.code==key){
      return true;
    }
  }
  return false;
}


export function numberFormat(number): string {
  return number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}

export function randomNumber(length): string {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function randomStringNumber(length): string {
  let result = "";
  const characters =
    "abcdefghijklmnpqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function dateToTimestamp(date): number {
  return Math.floor(new Date(date).getTime() / 1000);
}

export function timestampToDate(timestamp): Date {
  return new Date((timestamp - 60 * 60 * 5) * 1000);
}
