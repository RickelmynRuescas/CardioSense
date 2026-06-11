import admin from 'firebase-admin'
import dotenv from 'dotenv'

dotenv.config()

console.log('PROJECT_ID:', process.env.FIREBASE_PROJECT_ID)
console.log('CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL)
console.log('PRIVATE_KEY starts with:', process.env.FIREBASE_PRIVATE_KEY?.substring(0, 40))

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
})

const db = admin.firestore()

async function test() {
  try {
    console.log('\nTestando escrita no Firestore...')
    await db.collection('test').doc('ping').set({ ok: true, ts: new Date().toISOString() })
    console.log('✅ Firestore OK — escrita funcionou!')
  } catch (err: any) {
    console.error('❌ Erro no Firestore:', err.code, err.message)
  }
  process.exit(0)
}

test()
