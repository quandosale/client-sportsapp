
import { Pipe, Injectable, PipeTransform } from '@angular/core';

@Pipe({
    name: 'mysearch',
    pure: false
})
@Injectable()
export class SearchPipe implements PipeTransform {
    transform(items: any[], args: any): any {        
        return items.filter(item => item.username.includes(args));
    }
}
