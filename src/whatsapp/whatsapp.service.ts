import { Injectable , HttpService, Logger} from '@nestjs/common';
import { INSTANCE, TOKEN } from "../config/whatsapp.config";
import { SendMessageDto } from "./dto/send-message.dto";

@Injectable()
export class WhatsappService {
    private logger = new Logger("WhatsappService");
    private baseEndPoint: string = "https://eu272.chat-api.com";
    constructor(private http: HttpService) {}

    async sendMessage(sendMessageDto: SendMessageDto): Promise<boolean> {
        const { chatId, body } = sendMessageDto;
        const data = {
          chatId: chatId,
          body: body,
        };
    
        try {
          const result = await this.http
            .post(`${this.baseEndPoint}/${INSTANCE}/message?token=${TOKEN}`, data)
            .toPromise();
          return result.data.sent;
        } catch (error) {
          this.logger.error(
            `Error al enviar el Whatsapp : ${JSON.stringify(sendMessageDto)}`,
            error.stack
          );
        }
        return false;
      }
    
      async lookup(sendMessageDto: SendMessageDto): Promise<boolean> {
        const { phone } = sendMessageDto;
        try {
          const result = await this.http
            .get(`${this.baseEndPoint}/${INSTANCE}/checkPhone?token=${TOKEN}&phone=${phone}`)
            .toPromise();

          return result.data.result =='exists';
        } catch (error) {
          this.logger.error(
            `Error al validar el número de Whatsapp : ${JSON.stringify(sendMessageDto)}`,
            error.stack
          );
        }
        return false;
      }
}
