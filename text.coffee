[!] The following Swift pods cannot yet be integrated as static libraries:

The Swift pod `FirebaseCoreInternal` depends upon `GoogleUtilities`, which does not define modules. To opt into those targets generating module maps (which is necessary to import them from Swift when building as static libraries), you may set `use_modular_headers!` globally in your Podfile, or specify `:modular_headers => true` for particular dependencies.

The Swift pod `FirebaseFirestore` depends upon `FirebaseCore`, `FirebaseCoreExtension`, and `FirebaseFirestoreInternal`, which do not define modules. To opt into those targets generating module maps (which is necessary to import them from Swift when building as static libraries), you may set `use_modular_headers!` globally in your Podfile, or specify `:modular_headers => true` for particular dependencies.

The Swift pod `FirebaseStorage` depends upon `FirebaseAppCheckInterop`, `FirebaseAuthInterop`, `FirebaseCore`, `FirebaseCoreExtension`, and `GTMSessionFetcher`, which do not define modules. To opt into those targets generating module maps (which is necessary to import them from Swift when building as static libraries), you may set `use_modular_headers!` globally in your Podfile, or specify `:modular_headers => true` for particular dependencies.
