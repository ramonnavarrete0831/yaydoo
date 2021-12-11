import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { whatsappDto } from './dto/whatsapp.dto';

@Controller('webhook')
export class WebhookController {
    @Post("/whatsapp")
    async whatsapp(@Body(ValidationPipe) whatsappDto : whatsappDto ): Promise<void> {
        console.log(whatsappDto.instanceId);

        const minimal_distance = 6500; // Distancia mínima recorrida
        const kilometer_change = 100; //Cambio de KM en metros
        const minimum_shipping_cost = 35; //Precio Mínimo de envío
        const additional_km_price = 5 ; // Costo por Kilometro adicional
        

        for (let index = 25; index <= 150; index++) {
            const distance = index * 100;
        	let cost_of_shipping = minimum_shipping_cost;
            if(distance>=(minimal_distance+kilometer_change)){
        		const extra_distance = distance-(minimal_distance+kilometer_change);
        		cost_of_shipping=(minimum_shipping_cost+additional_km_price)+(((extra_distance/1000)|0)*additional_km_price);
        	}
            console.log(`${(distance/1000)}, km : $${cost_of_shipping}`);
        }

        /*
        for ($i = 25; $i <= 150; $i++) {
            $distance = $i*100;
        	$cost_of_shipping=$minimum_shipping_cost;
        			
        	if($distance>=($minimal_distance+$kilometer_change)){
        		$extra_distance = $distance-($minimal_distance+$kilometer_change);
        		$cost_of_shipping=($minimum_shipping_cost+$additional_km_price)+(intval(($extra_distance/1000))*$additional_km_price);
        	}
        	echo "".($distance/1000).", km : $".$cost_of_shipping."<br>";
        }*/

    

    }
}
