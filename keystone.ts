// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config

import { config } from '@keystone-6/core';

// to keep this file tidy, we define our schema in a different file
import { lists } from './schema';

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { withAuth, session } from './auth';
import dotenv from "dotenv"
import type { StorageConfig } from '@keystone-6/core/types'


dotenv.config();

export default withAuth(
    config({
        db: {
        provider: 'sqlite',
        url: 'file:./keystone.db',
        },
        lists,
        session,
        storage: {
            files: {
                kind: 'local',
                type: 'file',
                generateUrl: path => `/files${path}`,
                serverRoute: {
                path: '/files',
                },
                storagePath: 'public/files',
            },
        },
    })
);
