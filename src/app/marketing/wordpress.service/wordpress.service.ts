import { WPAPI } from 'wpapi';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

//see https://github.com/WP-API/node-wpapi

@Injectable()
export class WordpressService {
    public wp = new WPAPI({ endpoint: 'http://src.wordpress-develop.dev/wp-json' });
    public apiPromise = WPAPI.discover('https://www.xbms.io').then(function (site) {
        return site.auth({
            username: 'admin',
            password: 'always use secure passwords'
        });
    });

    constructor() { 

    this.wp.posts().create({
        // "title" and "content" are the only required properties
        title: 'Your Post Title',
        content: 'Your post content',
        // Post will be created as a draft by default if a specific "status"
        // is not specified
        status: 'publish'
    }).then(function( response ) {
        // "response" will hold all properties of your newly-created post,
        // including the unique `id` the post was assigned on creation
        console.log( response.id );
    })
}
}