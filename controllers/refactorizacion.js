function postConfirm(params) {
    const id = params.service_id;
    let servicio = Service.find(id);
    // console.log(servicio);
    switch(servicio.status_id) {
        case 1:
            if (servicio.driver_id == NULL) {
                Driver.update(params.driver_id, {
                    available: 0
                });
                driver = Driver.find(params.driver_id);
                Service.update(id, {
                    driver_id: params.driver_id,
                    status_id: 2,
                    car_id: driver.car_id
                    //Up carro
                    //, pwd: md5(params.pwd)
                });
                servicio = Service.find(id);
                //Notificar a usuario!!
                var pushMessage = "Tu servicio ha sido confirmado!";
                /* servicio = Service.find(id);
                push = Push.make();
                if (servicio.user.type == '1') {//iPhone
                pushAns = push.ios(servicio.user.uuid, pushMessage);
                } else {
                pushAns = push.android2(servicio.user.uuid, pushMessage);
                } */
                push = Push.make();
                if (servicio.user.uuid != '') {
                    if (servicio.user.type == 1) { //iPhone
                        push.ios(servicio.user.uuid, pushMessage, 1, 'honk.wav', 'Open', {service_id: service.id});
                    } else {
                        push.android2(servicio.user.uuid, pushMessage, 1, 'default', 'Open', {service_id: service.id});
                    }
                }
                return {error: 0};
            } else {
                return {error: 1};
            }
            break;
        case 6:
            return {error: 2};
            break;
        default:
            return {error: 3};
    }
};