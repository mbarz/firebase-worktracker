import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    const minutes: number = value;
    const hours: number = Math.floor(minutes / 60);

    return [hours, minutes - hours * 60]
      .map(n => n.toString().padStart(2, '0'))
      .join(':');
  }
}
