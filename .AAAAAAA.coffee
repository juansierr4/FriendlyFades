Expected package metro-resolver@~0.80.4
Found invalid:
  metro-resolver@0.79.1
  (for more info, run: npm why metro-resolver)
Expected package metro-config@~0.80.4
Found invalid:
  metro-config@0.79.1
  (for more info, run: npm why metro-config)
Advice: Upgrade dependencies that are using the invalid package versions0.

The package "expo-modules-core" should not be installed directly in your project. It is a dependency of other Expo packages, which will install it automatically as needed.
The package "expo-dev-launcher" should not be installed directly in your project. It is a dependency of other Expo packages, which will install it automatically as needed.

This project has native project folders but is also configured to use Prebuild. EAS Build will not sync your native configuration if the ios or android folders are present. Add these folders to your .gitignore file if you intend to use prebuild (aka "managed" workflow).

One or more checks failed, indicating possible issues with the project.
