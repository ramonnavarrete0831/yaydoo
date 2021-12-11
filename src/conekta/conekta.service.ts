import {
  Injectable,
  HttpService,
  Logger,
  InternalServerErrorException,
} from "@nestjs/common";
import { encode } from "base-64";

import { CONEKTA_CONFIG } from "../config/conekta.config";
import { CustomerDto } from "./dto/customer.dto";
import { OrderDto } from "./dto/order.dto";

@Injectable()
export class ConektaService {
  private logger = new Logger("ConektaService");
  private baseEndPoint: string = "https://api.conekta.io";

  constructor(private http: HttpService) {}

  private getHeader() {
    const headersRequest = {
      Accept: "application/vnd.conekta-v2.0.0+json",
      "Content-Type": "application/json",
      Authorization: `Basic ${encode(CONEKTA_CONFIG.KEY)}`,
    };
    return headersRequest;
  }

  async createCustomer(customerDto: CustomerDto): Promise<void> {
    const { name, phone, email } = customerDto;

    const data = {
      name: name,
      phone: `+521${phone}`,
      email: email,
    };

    try {
      const result = await this.http
        .post(`${this.baseEndPoint}/customers`, data, {
          headers: this.getHeader(),
        })
        .toPromise();

      customerDto.id = result.data.id;
    } catch (error) {
      customerDto.error = error.response.data.details;
      this.logger.error(
        `Error al realizar al crear el cliente en Conekta, datos : ${JSON.stringify(
          customerDto
        )}, errors: ${JSON.stringify(customerDto.error)} `
      );
      const errors = [];
      for (let index = 0; index < customerDto.error.length; index++) {
        errors.push(customerDto.error[index].message);
      }
      throw new InternalServerErrorException(errors);
    }
  }

  async updateCustomer(customerDto: CustomerDto): Promise<void> {
    const { id, name, phone, email } = customerDto;

    const data = {
      name: name,
      phone: `+521${phone}`,
      email: email,
    };

    try {
      const result = await this.http
        .put(`${this.baseEndPoint}/customers/${id}`, data, {
          headers: this.getHeader(),
        })
        .toPromise();

      customerDto.id = result.data.id;
    } catch (error) {
      customerDto.error = error.response.data.details;
      this.logger.error(
        `Error al realizar la actualización de cliente en Conekta, datos : ${JSON.stringify(
          customerDto
        )}, errors: ${JSON.stringify(customerDto.error)} `
      );
      const errors = [];
      for (let index = 0; index < customerDto.error.length; index++) {
        errors.push(customerDto.error[index].message);
      }
      throw new InternalServerErrorException(errors);
    }
  }

  async deleteCustomer(customerDto: CustomerDto): Promise<void> {
    const { id } = customerDto;

    try {
      await this.http
        .delete(`${this.baseEndPoint}/customers/${id}`, {
          headers: this.getHeader(),
        })
        .toPromise();
    } catch (error) {
      customerDto.error = error.response.data.details;
      this.logger.error(
        `Error al realizar eliminar al cliente en Conekta, datos : ${JSON.stringify(
          customerDto
        )}, errors: ${JSON.stringify(customerDto.error)} `
      );
      const errors = [];
      for (let index = 0; index < customerDto.error.length; index++) {
        errors.push(customerDto.error[index].message);
      }
      throw new InternalServerErrorException(errors);
    }
  }

  async createCard(customerDto: CustomerDto): Promise<void> {
    const { id } = customerDto;
    const { token_id } = customerDto.card;

    const data = {
      type: "card",
      token_id,
    };

    try {
      const result = await this.http
        .post(`${this.baseEndPoint}/customers/${id}/payment_sources`, data, {
          headers: this.getHeader(),
        })
        .toPromise();
      customerDto.card.id = result.data.id;
      customerDto.card.last4 = result.data.last4;
      customerDto.card.name = result.data.name;
      customerDto.card.exp_month = result.data.exp_month;
      customerDto.card.exp_year = result.data.exp_year;
      customerDto.card.brand = result.data.brand;
    } catch (error) {
      customerDto.error = error.response.data.details;
      this.logger.error(
        `Error al asignar la tarjeta al cliente en Conekta, datos : ${JSON.stringify(
          customerDto
        )}, errors: ${JSON.stringify(customerDto.error)} `
      );
      const errors = [];
      for (let index = 0; index < customerDto.error.length; index++) {
        errors.push(customerDto.error[index].message);
      }
      throw new InternalServerErrorException(errors);
    }
  }

  async deleteCard(customerDto: CustomerDto): Promise<void> {
    const { id } = customerDto;
    const { id: src_id } = customerDto.card;
    try {
      const result = await this.http
        .delete(
          `${this.baseEndPoint}/customers/${id}/payment_sources/${src_id}`,
          {
            headers: this.getHeader(),
          }
        )
        .toPromise();
      customerDto.card.deleted = result.data.deleted;
    } catch (error) {
      customerDto.error = error.response.data.details;
      this.logger.error(
        `Error al eliminar la tarjeta al cliente en Conekta, user_id: ${id}, datos : ${JSON.stringify(
          customerDto
        )}, errors: ${JSON.stringify(customerDto.error)} `
      );
      const errors = [];
      for (let index = 0; index < customerDto.error.length; index++) {
        errors.push(customerDto.error[index].message);
      }
      throw new InternalServerErrorException(errors);
    }
  }

  async createOrder(orderDto: OrderDto): Promise<boolean> {
    const { order_id, amount, type } = orderDto;
    const { id: customer_id } = orderDto.customer;
    const { id: payment_source } = orderDto.card;

    const expires_at = Math.floor(Date.now() / 1000) + 60 * 60 * 3;

    const data = {
      currency: "MXN",
      line_items: [
        {
          name: `PASTELERITOS RESPOSTERÍA, PEDIDO ${order_id}`,
          unit_price: amount,
          quantity: 1,
        },
      ],
      customer_info: {
        customer_id,
      },
      charges: [
        {
          payment_method:
            type === "oxxo_cash" || type === "spei"
              ? {
                  type,
                  expires_at,
                }
              : type === "card" && {
                  type: "default",
                  token_id: payment_source,
                },
        },
      ],
      metadata: {
        id: order_id,
      },
    };

    try {
      const result = await this.http
        .post(`${this.baseEndPoint}/orders`, data, {
          headers: this.getHeader(),
        })
        .toPromise();

      orderDto.id = result.data.id;
      orderDto.payment_status = result.data.payment_status;
      orderDto.customer.id = result.data.customer_info.customer_id;
      orderDto.customer.name = result.data.customer_info.name;
      orderDto.customer.phone = result.data.customer_info.phone;
      orderDto.customer.email = result.data.customer_info.email;

      if (type === "card") {
        orderDto.payment.exp_month =
          result.data.charges.data[0].payment_method.exp_month;
        orderDto.payment.exp_year =
          result.data.charges.data[0].payment_method.exp_year;
        orderDto.payment.last4 =
          result.data.charges.data[0].payment_method.last4;
        orderDto.payment.brand =
          result.data.charges.data[0].payment_method.brand;
      } else if (type === "oxxo_cash") {
        orderDto.payment.barcode_url =
          result.data.charges.data[0].payment_method.barcode_url;
        orderDto.payment.expires_at =
          result.data.charges.data[0].payment_method.expires_at;
        orderDto.payment.reference =
          result.data.charges.data[0].payment_method.reference;
      } else if (type === "spei") {
        orderDto.payment.clabe =
          result.data.charges.data[0].payment_method.clabe;
        orderDto.payment.expires_at =
          result.data.charges.data[0].payment_method.expires_at;
        orderDto.payment.bank = result.data.charges.data[0].payment_method.bank;
      }

      return true;
    } catch (error) {
    }
    return false;
  }
}
