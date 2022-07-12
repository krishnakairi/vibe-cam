// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const Pusher = require("pusher");

export default function handler(req, res) {

  if (req.method === 'POST') {

    const { connectionId, signal, peerId } = req.body

    const pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.PUSHER_CLUSTER,
      useTLS: true
    });
  
    /**
     * todo
     * validate req.body, check for XSS attack
     */
    console.log(`vibe-cam-${connectionId}`, JSON.stringify(signal))
    pusher.trigger(`vibe-cam-${connectionId}`, "signal", { peerId, signal });
  
    res.status(200).json({ status: true, error: null })
  }

  res.status(400).json({ status: false, error: 'ivalid route'});
}
