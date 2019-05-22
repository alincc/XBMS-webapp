
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safeHtml' })
export class SafeHtml implements PipeTransform{
    constructor(private sanitizer: DomSanitizer) { }

    transform(html): any {
        return this.sanitizer.bypassSecurityTrustHtml(html);
        // return this.sanitizer.bypassSecurityTrustStyle(style);
        // return this.sanitizer.bypassSecurityTrustXxx(style); - see docs
    }
}