<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestController extends Controller
{
    //
    public function test()
    {
        $a = 2;
    	return 'hello! how are you!';
    	// echo sizeof(1);
    }
}
