export default async function handler(req, res) {
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": process.env.MONGODB_DATA_API_KEY,
    },
  };
  const fetchBody = {
    dataSource: process.env.MONGODB_DATA_SOURCE,
    database: "test",
    collection: "tweets",
  };


  const baseUrl = `${process.env.MONGODB_DATA_API_URL}/action`;
  try {
    switch (req.method) {
      case "GET":
        const readData = await fetch(`${baseUrl}/find`, {
          ...fetchOptions,
          body: JSON.stringify({
            ...fetchBody,
            sort: { postedAt: -1 },
          }),
        });
        const readDataJson = await readData.json();
        res.status(200).json(readDataJson.documents);
        break;

      case "POST":
        const flutter = req.body;
        const insertData = await fetch(`${baseUrl}/insertOne`, {
          ...fetchOptions,
          body: JSON.stringify({
            ...fetchBody,
            document: flutter,
          }),
        });
        const insertDataJson = await insertData.json();
        res.status(200).json(insertDataJson);
        break;

      case "PUT":
        const updatedFlutter = req.body.body;

        const updateData = await fetch(`${baseUrl}/updateOne`, {
          ...fetchOptions,
          body: JSON.stringify({
            ...fetchBody,	
            filter: { _id: { $oid: req.body.id } },
            update: { $set: { body: updatedFlutter } },
          }),
        });

				const updateJson = await updateData.json();
				res.status(200).json(updateJson);
				break;

			case "DELETE":
				const deleteData = await fetch(`${baseUrl}/deleteOne`, {
					...fetchOptions,
					body: JSON.stringify({
						...fetchBody,
						filter: { _id: { $oid: req.body.id } },
					}),
				});

				const deleteJson = await deleteData.json();
				res.status(200).json(deleteJson);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}
