import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientePago, UPaymentService } from 'src/app/core/http/u_payment/u-payment.service';
import { LoaderService } from '../shared/loaderService/loader.service';
import { EMPTY, Subscription, catchError, finalize, interval, switchMap, takeWhile } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TextDialogComponent } from '../shared/text-dialog/text-dialog.component';

@Component({
    selector: 'app-pagos',
    templateUrl: './pagos.component.html',
    styleUrls: ['./pagos.component.css']
})
export class PagosComponent {
    uuid: string = this._route.snapshot.params['id'];

    paymentData: any = {
        var_description: '',
        num_total: 0,
        var_status: 'PENDING'
    }
    agreedToTerms = false;
    showTermsWarning = false;

    // Colectas: Cobrana exige DNI, nombre y apellido y nadie los cargó antes.
    cliente: ClientePago = { dni: '', nombre: '', apellido: '' };
    cargoUrl = '';
    private sondeo?: Subscription;

    get clienteValido(): boolean {
        const dni = this.cliente.dni.replace(/[^0-9A-Za-z]/g, '');
        return dni.length >= 6 && dni.length <= 20 && !!this.cliente.nombre.trim() && !!this.cliente.apellido.trim();
    }

    get pagoDeshabilitado(): boolean {
        return !this.agreedToTerms || (this.paymentData.requiere_datos && !this.clienteValido);
    }

    constructor(
        private readonly _route: ActivatedRoute,
        private readonly _paymentService: UPaymentService,
        private readonly _loaderService: LoaderService,
        private readonly dialog: MatDialog,
    ) {
        this._loaderService.show();

        this._paymentService.getPaymentData(this.uuid).pipe(
            finalize(() => {
                this._loaderService.hide();
            })
        ).subscribe({
            next: (data) => {
                this.paymentData = data;
                console.log(data);
            },
            error: (error) => {
                this.paymentData = {
                    var_status: 'ERROR'
                }
                console.log(error);
            }
        });
    }

    openTermsDialog() {
        this.dialog.open(TextDialogComponent, {
            minWidth: '300px',
            disableClose: false,
            data: {
                text: this.terms
            }
        })
    }

    onPayButtonClicked() {
        this.showTermsWarning = true;
    }

    // El cargo ya existe en Cobrana: Active Mode no recibe al padre de vuelta, así que consulta el estado hasta que el webhook lo marque pagado.
    onCargoCreado(url: string) {
        this.cargoUrl = url;
        this.sondeo?.unsubscribe();
        this.sondeo = interval(5000).pipe(
            switchMap(() => this._paymentService.getPaymentData(this.uuid).pipe(catchError(() => EMPTY))),
            takeWhile((data: any) => data.var_status === 'PENDING', true),
        ).subscribe((data) => this.paymentData = data);
    }

    ngOnDestroy() {
        this.sondeo?.unsubscribe();
    }

    terms: string = `Acuerdo\n

SERVICIOS EDCUCATIVOS SAN JOSÉ DE MONTERRICO S.A. con RUC 20196818236 ubicado en Jr. Tomasal N°355 – Santiago de Surco, representada por la Sra. Eliana Yamashiro Nakamura identificada con DNI N°08, promueve los talleres deportivos y artísticos ACTIVE MODE.
\n
En ACTIVE MODE se ofrecerá una metodología de enseñanza orientada a los diversos tipos de aprendizaje para las disciplinas deportivas y artísticas, perfeccionar sus fundamentos técnicos, desarrollar habilidades y potenciar sus capacidades físicas. Asimismo, propiciar un espacio recreativo, socializador con práctica de valores que permitan ejemplarizar hábitos de vida saludable. ACTIVE MODE se orienta a dos segmentos de atención, uno para estudiantes desde los 8 años hasta los 12 en un primer bloque comprendido en el horario de 5:00 a 6:00 pm, y otro de 13 años a más de 6:00 a 7:00 pm. En el segundo segmento, se oferta la atención al sector adulto en el horario de 7:00 a 9:00 pm.
\n
Las inscripciones las podrán realizar de forma presencial o virtual ingresando a la página web www.activemodeperu.com
\n
Las inscripciones se realizarán según horario, frecuencia y cupos disponible que figure en cada actividad.
\n
Las inscripciones pueden ser de periodicidad mensual o hasta trimestrales, si desea continuar deberá renovarla de acuerdo con los plazos establecidos.
\n
Los talleres presentan sus propios cupos, edades, niveles y horarios vigentes.
\n
Los aforos máximos varían dependiendo del taller a inscribirse.
\n
Solo se permitirá el ingreso a las instalaciones a las personas inscritas en los talleres en el horario que se encuentran inscritos y siempre que hayan realizado el pago respectivo.
\n
En el caso de menores de 14 años se permitirá el ingreso de un solo acompañante.
\n
En el caso de menores de edad inscritos es responsabilidad del padre, madre o tutor cualquier daño material o personal que se cause dentro de las instalaciones. En el caso de adultos, son responsables ellos mismos.
La entidad no ofrece ningún tipo de seguro de accidentes, por lo que se recomienda a todos los inscritos contar con uno.
De no contratar un seguro de accidentes o de no encontrarse vigente, los inscritos (o sus padres y/o apoderados en caso de menores de edad) asumen toda responsabilidad de las consecuencias y costos que deriven de un eventual accidente que puedan sufrir. Asimismo, es de su cargo toda suma no cubierta por la póliza de seguros.
\n
La entidad no se responsabiliza por pérdidas o daños a sus pertenencias.
\n
El participante asume la responsabilidad y compromiso de mantener, en todo momento, las buenas costumbres y respeto, teniendo en cuenta las normas de convivencia social. La Entidad se reserva el derecho de ingreso de las personas que no cumplen con esta norma. Asimismo, requerirá el retiro de las instalaciones en esos casos.
\n
La entidad recomienda que antes de inscribirse, los inscritos revisen su estado de salud con un médico, y que les confirme que están aptos para los talleres en los que se inscribirán. El inscrito declara que goza de buena salud física, mental y se encuentra apto para la práctica de actividad física y exonera de toda responsabilidad a Servicios Educativos San José de Monterrico S.A., de cualquier hecho que pudiera afectar a la salud por motivo de la práctica de actividad física.
\n
Los inscritos deberán respetar los términos y condiciones establecidos por la entidad, en caso de no cumplir perderán el cupo asignado y no habrá devolución del monto pagado.
\n
La entidad no ofrece vigilancia externa por lo que no asume responsabilidad alguna por daños personales o materiales que pudieran ocurrir al momento del ingreso o salida de nuestras instituciones, tales como robos personales, choques, robos de autopartes y/o de vehículos y/o de bienes dentro de vehículos.
\n
Políticas de devolución, ante la inasistencia a clases, no habrá derecho a recuperación de clases, ni cambio de fecha, ni devolución de dinero. Se realizará la devolución de la inscripción siempre y cuando se informe, vía correo electrónico, 72 horas antes de la primera clase del mes.
\n
Atención al cliente e información de contacto, se realizará por la página web www.activemodeperu.com, escribiendo al WhatsApp 960192400 o por email activemode@sjm.edu.pe.
\n
Todos los pagos con tarjetas de créditos se manejan con la pasarela de pagos de Niubiz.
\n
Nos reservamos el derecho de modificar, adicionar y/o complementar estas normas. Todas estas modificaciones adicionales y demás entrarán en vigor inmediatamente, salvo disposición expresa en contrario. La desobediencia o violación de las disposiciones de estos Términos y Condiciones podrá dar lugar a la suspensión temporal o expulsión definitiva de los usuarios infractores, con la correspondiente cancelación de los derechos del afiliado, así como también en los casos en que su comportamiento sea considerado molesto, perturbador, inmoral o fraudulento.`
}
