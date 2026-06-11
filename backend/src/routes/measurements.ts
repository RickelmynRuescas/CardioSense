import { Router, Response } from 'express'
import { db } from '../config/firebase'
import { verifyToken, AuthRequest } from '../middlewares/auth'

const router = Router()

router.post('/', verifyToken, async (req: AuthRequest, res: Response) => {
  const { bpm, bpmStatus, riskLevel } = req.body

  if (!bpm) {
    res.status(400).json({ error: 'BPM é obrigatório' })
    return
  }

  try {
    const docRef = await db
      .collection('users')
      .doc(req.userId!)
      .collection('measurements')
      .add({
        bpm,
        bpmStatus: bpmStatus ?? null,
        riskLevel: riskLevel ?? null,
        createdAt: new Date().toISOString(),
      })

    res.status(201).json({ id: docRef.id, message: 'Medição salva com sucesso' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const snapshot = await db
      .collection('users')
      .doc(req.userId!)
      .collection('measurements')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get()

    const measurements = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    res.json(measurements)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/all', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const snapshot = await db
      .collection('users')
      .doc(req.userId!)
      .collection('measurements')
      .get()

    const batch = db.batch()
    snapshot.docs.forEach(doc => batch.delete(doc.ref))
    await batch.commit()

    res.json({ message: 'Histórico apagado com sucesso' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params

  try {
    await db
      .collection('users')
      .doc(req.userId!)
      .collection('measurements')
      .doc(id)
      .delete()

    res.json({ message: 'Medição removida com sucesso' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
