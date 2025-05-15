// utils/loadTemplate.js
import fs from 'fs';
import path from 'path';

export function getOtpEmailHtml({otp} : {otp: string}) {
  const filePath = path.join(process.cwd(), 'src', 'templates', 'otpTemplate.html');
  let template = fs.readFileSync(filePath, 'utf-8');
  return template.replace('{{otp}}', otp);
}
