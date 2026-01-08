import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ITEMS_PER_PAGE = 10;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  const { table: tableName } = await params;
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * ITEMS_PER_PAGE;

    let data: any[] = [];
    let total = 0;

    switch (tableName) {
      case "users":
        data = await prisma.user.findMany({
          skip,
          take: ITEMS_PER_PAGE,
          orderBy: { createdAt: "desc" },
        });
        total = await prisma.user.count();
        break;
      case "notes":
        data = await prisma.note.findMany({
          skip,
          take: ITEMS_PER_PAGE,
          orderBy: { createdAt: "desc" },
          include: { owner: { select: { email: true, name: true } } },
        });
        total = await prisma.note.count();
        break;
      case "categories":
        data = await prisma.category.findMany({
          skip,
          take: ITEMS_PER_PAGE,
        });
        total = await prisma.category.count();
        break;
      case "life_scripts":
        data = await prisma.lifeScript.findMany({
          skip,
          take: ITEMS_PER_PAGE,
          orderBy: { createdAt: "desc" },
          include: {
            owner: { select: { email: true, name: true } },
            category: { select: { category: true } },
          },
        });
        total = await prisma.lifeScript.count();
        break;
      case "tags":
        data = await prisma.tag.findMany({
          skip,
          take: ITEMS_PER_PAGE,
        });
        total = await prisma.tag.count();
        break;
      case "tag_on_life_script":
        data = await prisma.tagOnLifeScript.findMany({
          skip,
          take: ITEMS_PER_PAGE,
          include: {
            lifeScript: { select: { title: true } },
            tag: { select: { name: true } },
          },
        });
        total = await prisma.tagOnLifeScript.count();
        break;
      case "votes":
        data = await prisma.vote.findMany({
          skip,
          take: ITEMS_PER_PAGE,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { email: true } },
            lifeScript: { select: { title: true } },
          },
        });
        total = await prisma.vote.count();
        break;
      default:
        return NextResponse.json(
          { error: "Таблица не найдена" },
          { status: 404 }
        );
    }

    return NextResponse.json({
      data,
      total,
      page,
      totalPages: Math.ceil(total / ITEMS_PER_PAGE),
    });
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
    return NextResponse.json(
      { error: "Ошибка при получении данных" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  try {
    const { table: tableName } = await params;
    const body = await request.json();

    let result;

    switch (tableName) {
      case "users":
        result = await prisma.user.create({ data: body });
        break;
      case "notes":
        result = await prisma.note.create({ data: body });
        break;
      case "categories":
        result = await prisma.category.create({ data: body });
        break;
      case "life_scripts":
        result = await prisma.lifeScript.create({ data: body });
        break;
      case "tags":
        result = await prisma.tag.create({ data: body });
        break;
      case "tag_on_life_script":
        result = await prisma.tagOnLifeScript.create({ data: body });
        break;
      case "votes":
        result = await prisma.vote.create({ data: body });
        break;
      default:
        return NextResponse.json(
          { error: "Таблица не найдена" },
          { status: 404 }
        );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Ошибка при создании записи:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка при создании записи" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  try {
    const { table: tableName } = await params;
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID обязателен для обновления" },
        { status: 400 }
      );
    }

    let result;

    switch (tableName) {
      case "users":
        result = await prisma.user.update({ where: { id }, data });
        break;
      case "notes":
        result = await prisma.note.update({ where: { id }, data });
        break;
      case "categories":
        result = await prisma.category.update({ where: { id }, data });
        break;
      case "life_scripts":
        result = await prisma.lifeScript.update({ where: { id }, data });
        break;
      case "tags":
        result = await prisma.tag.update({ where: { id }, data });
        break;
      case "tag_on_life_script":
        result = await prisma.tagOnLifeScript.update({ where: { id }, data });
        break;
      case "votes":
        result = await prisma.vote.update({ where: { id }, data });
        break;
      default:
        return NextResponse.json(
          { error: "Таблица не найдена" },
          { status: 404 }
        );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Ошибка при обновлении записи:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка при обновлении записи" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  try {
    const { table: tableName } = await params;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID обязателен для удаления" },
        { status: 400 }
      );
    }

    switch (tableName) {
      case "users":
        await prisma.user.delete({ where: { id } });
        break;
      case "notes":
        await prisma.note.delete({ where: { id } });
        break;
      case "categories":
        await prisma.category.delete({ where: { id } });
        break;
      case "life_scripts":
        await prisma.lifeScript.delete({ where: { id } });
        break;
      case "tags":
        await prisma.tag.delete({ where: { id } });
        break;
      case "tag_on_life_script":
        await prisma.tagOnLifeScript.delete({ where: { id } });
        break;
      case "votes":
        await prisma.vote.delete({ where: { id } });
        break;
      default:
        return NextResponse.json(
          { error: "Таблица не найдена" },
          { status: 404 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Ошибка при удалении записи:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка при удалении записи" },
      { status: 500 }
    );
  }
}

