<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use MongoDB\BSON\ObjectId;

class TaskController extends Controller
{
    public function index()
    {
        return Task::latest()->get();
    }

    public function store(Request $request)
    {
        return Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'completed' => false,
        ]);
    }

    public function destroy($id)
    {
        Task::where('_id', new ObjectId($id))->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function toggle($id)
    {
        $task = Task::where('_id', new ObjectId($id))->firstOrFail();
        $task->completed = !$task->completed;
        $task->save();

        return $task;
    }
}