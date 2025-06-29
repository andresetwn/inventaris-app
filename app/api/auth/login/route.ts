import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const body = await req.json();
  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json(
      { message: "Username dan password wajib diisi" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("admin")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { message: "Username tidak ditemukan" },
      { status: 401 }
    );
  }

  if (data.password !== password) {
    return NextResponse.json({ message: "Password salah" }, { status: 401 });
  }

  const token = Buffer.from(`${username}:${password}`).toString("base64");

  return NextResponse.json({
    message: "Login berhasil",
    token,
    user: data.username,
  });
}
