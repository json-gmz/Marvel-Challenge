function post_confirm(params) {
    const id = params.service_id;
    let servicio = Service.find(id);
    // console.log(servicio);
    if (servicio != NULL) {
        if (servicio.status_id == '6') {
            return {
                error: '2'
            };
        }
        if (servicio.driver_id == NULL && servicio.status_id == '1') {
            servicio = Service.update(id, {
                driver_id: params.driver_id,
                status_id: '2'
                //Up carro
                //, pwd: md5(params.pwd)
            });
            Driver.update(params.driver_id, {
                available: '0'
            });
            driverTmp = Driver.find(params.driver_id);
            Service.update(id, {
                car_id: driverTmp.car_id
                //Up carro
                //, pwd: md5(params.pwd)
            });
            //Notificar a usuario!!
            var pushMessage = "Tu servicio ha sido confirmado!";
            /* servicio = Service.find(id);
            push = Push.make();
            if (servicio.user.type == '1') {//iPhone
            pushAns = push.ios(servicio.user.uuid, pushMessage);
            } else {
            pushAns = push.android2(servicio.user.uuid, pushMessage);
            } */
            servicio = Service.find(id);
            push = Push.make();
            if (servicio.user.uuid == '') {
                return {
                    error: '0'
                };
            }
            if (servicio.user.type == '1') { //iPhone
                push.ios(servicio.user.uuid, pushMessage, 1, 'honk.wav', 'Open', {
                    service_id: service.id
                });
            } else {
                push.android2(servicio.user.uuid, pushMessage, 1, 'default', 'Open', {
                    service_id: service.id
                });
            }
            return {
                error: '0'
            };
        } else {
            return {
                error: '1'
            };
        }
    } else {
        return {
            error: '3'
        };
    }
};