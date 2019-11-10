import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    const seconds = Math.floor(value / 1000);
    const minutes: number = Math.floor(seconds / 60);
    const hours: number = Math.floor(minutes / 60);

    return [hours, minutes - hours * 60]
      .map(n => n.toString().padStart(2, '0'))
      .join(':');
  }
}
