<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    // LIST PRODUK
    public function index()
    {
        return response()->json(Product::all());
    }

    // TAMBAH PRODUK
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'stock' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string'
        ]);

        $product = Product::create($request->all());

        return response()->json([
            'message' => 'Produk berhasil ditambahkan',
            'product' => $product
        ], 201);
    }

    // UPDATE PRODUK / STOK
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name' => 'required|string',
            'stock' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string'
        ]);

        $product->update($request->all());

        return response()->json([
            'message' => 'Produk berhasil diupdate',
            'product' => $product
        ]);
    }

    // HAPUS PRODUK
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'message' => 'Produk berhasil dihapus'
        ]);
    }
}
