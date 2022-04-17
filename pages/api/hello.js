import urlMetadata from "url-metadata";

export default function handler(req, res) {
  const url = req.query.url;
  console.log("url", url);
  urlMetadata("https://kidow.me")
    .then((metadata) => console.log("metadata", metadata))
    .catch((err) => console.log(err));
  res.status(200).json({ name: "John Doe" });
}
