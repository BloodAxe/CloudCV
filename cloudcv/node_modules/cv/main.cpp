#include <node.h>
#include <opencv2/opencv.hpp>
#include <string>

using namespace v8;

// This function returns a JavaScript number that is either 0 or 1.
Handle<Value> buildInformation(const Arguments& args)
{
    // At the top of every function that uses anything about v8, include a
    // definition like this. It ensures that any v8 handles you create in that
    // function are properly cleaned up. If you see memory rising in your
    // application, chances are that a scope isn't properly cleaned up.
    HandleScope scope;

    // When returning a value from a function, make sure to wrap it in
    // scope.Close(). This ensures that the handle stays valid after the current
    // scope (declared with the previous statement) is cleaned up.
    return scope.Close
    (
        // Creating a new JavaScript integer is as simple as passing a C int
        // (technically a int32_t) to this function.
        String::New(cv::getBuildInformation().c_str())
    );
}

void RegisterModule(Handle<Object> target)
{
    // target is the module object you see when require()ing the .node file.
    target->Set(String::NewSymbol("buildInformation"), FunctionTemplate::New(buildInformation)->GetFunction());
}

NODE_MODULE(cv, RegisterModule);