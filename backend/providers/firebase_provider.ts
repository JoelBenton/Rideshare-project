import type { ApplicationService } from '@adonisjs/core/types'
import admin, { ServiceAccount } from 'firebase-admin'

import serviceAccount from '../ServiceAccountKey.json' assert { type: 'json' }

export default class FirebaseProvider {
    constructor(protected app: ApplicationService) {}

    /**
     * The container bindings have booted
     */
    async boot() {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount as ServiceAccount),
            })
        }
    }
}
