import cors from 'cors';
import express from 'express';
import { isDev } from '@common/utils';
import { getLatestExtraID } from 'kideappbot';

const app = express();
const port = parseInt(process.env.PORT ?? '3000', 10);

app.use(
	cors({
		origin: isDev() ? '*' : process.env.ALLOWED_ORIGIN ?? '',
		credentials: true
	})
);

app.get('/extraid', async (req, res) => {
	const id = await getLatestExtraID();
	res.send(id);
});

app.listen(port, () => {
	console.log(`KideAppBot backend listening on port ${port}`);
});
