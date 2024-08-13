// app/api/genWeapon/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
	auth: process.env.REPLICATE_API_KEY,
});

export const POST = async (req: NextRequest) => {
	const { image, prompt } = await req.json();

	const input = {
		image: image,
		prompt: prompt,
		guidance: 8,
		a_prompt: 'world of warcraft concept art, fantasy',
		n_prompt: 'people, characters, creatures',
	};

	try {
		const output = await replicate.run(
			'jagilley/controlnet-scribble:435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117',
			{ input }
		);
		return NextResponse.json({ output });
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to generate image' },
			{ status: 500 }
		);
	}
};
