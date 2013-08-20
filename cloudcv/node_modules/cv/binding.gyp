{
  "targets": [
    {
      "target_name": "cv",
      "sources": [ "main.cpp" ],
	  "include_dirs": [ "/users/BloodAxe/Develop/opencv-node-bin/lib/inlcude/" ],  
      "link_settings": {
                        'libraries':    ['-lopencv_core -lopencv_features2d -lopencv_contrib'],
                        'library_dirs': ['/users/BloodAxe/Develop/opencv-node-bin/lib/'],
                       },
    }
  ]
}