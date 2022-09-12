<!DOCTYPE html>
<html lang="en">
    @auth 
    <head>
         @include('admin_layout.includes.head')
    </head>
    <body class="hold-transition sidebar-mini md-skin">
        <div class="wrapper">
            @include('admin_layout.includes.sidebar')
                <div class="content-wrapper mt-3">
                    @include('admin_layout.includes.footer')
                </div> <!-- /.content-wrapper -->
            @yield('admin_content')
        </div> 
        <div class="modal fade in" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        </div>
        @include('admin_layout.includes.js')
    </body>
    @else
        @include('auth.login')
    @endauth
</html>