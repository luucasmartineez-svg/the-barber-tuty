import { Pipe, PipeTransform } from "@angular/core";
@Pipe({ name: "duracion", standalone: true })
export class DuracionPipe implements PipeTransform {
  transform(minutos: number): string {
    const hs = Math.floor(minutos / 60);
    const min = minutos % 60;
    return hs ? `${hs} h${min ? ` ${min} min` : ""}` : `${min} min`;
  }
}
