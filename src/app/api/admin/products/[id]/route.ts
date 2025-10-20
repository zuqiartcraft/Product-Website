import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { validateAdminToken } from "@/lib/auth";

// Helper to check admin authentication
function checkAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  const token = authHeader.substring(7);
  return validateAdminToken(token);
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = checkAuth(request);

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const productData = await request.json();
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("products")
      .update({ ...productData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, product: data[0] });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = checkAuth(request);

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

// PATCH - Toggle product active status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = checkAuth(request);

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { is_active } = await request.json();
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("products")
      .update({ is_active, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, product: data[0] });
  } catch (error) {
    console.error("Error toggling product status:", error);
    return NextResponse.json(
      { error: "Failed to toggle product status" },
      { status: 500 }
    );
  }
}
