import { NextApiRequest, NextApiResponse } from "next";
import urlMetadata from 'url-metadata'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const metadata = await urlMetadata(req.query.url as string)
        return res.status(200).json(metadata)
    } catch (err) {
        res.status(400).json(err)
    }
}
