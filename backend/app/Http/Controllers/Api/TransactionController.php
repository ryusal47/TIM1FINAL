<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    // BUAT TRANSAKSI
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1'
        ]);

        return DB::transaction(function () use ($request) {
            $total = 0;

            $transaction = Transaction::create([
                'user_id' => auth()->id(),
                'total_price' => 0
            ]);

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);

                if ($product->stock < $item['quantity']) {
                    abort(400, 'Stok produk tidak mencukupi');
                }

                $product->decrement('stock', $item['quantity']);

                $subtotal = $product->price * $item['quantity'];
                $total += $subtotal;

                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price
                ]);
            }

            $transaction->update(['total_price' => $total]);

            return response()->json([
                'message' => 'Transaksi berhasil',
                'transaction' => $transaction->load('items.product')
            ], 201);
        });
    }

    // RIWAYAT TRANSAKSI
    public function index()
    {
        return response()->json(
            Transaction::with('items.product')->latest()->get()
        );
    }
}
