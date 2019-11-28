
import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'fileName' })
export class FileName implements PipeTransform{
    constructor() { }

    transform(file): any {
            return file.substring(file.lastIndexOf('/')+1);
    }
}

