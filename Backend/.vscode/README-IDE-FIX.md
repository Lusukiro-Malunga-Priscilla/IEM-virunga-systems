Steps to fix VS Code editor 'cannot be resolved to a type' errors

1) Rebuild the project with Maven (ensures code compiles):

```bash
mvn -DskipTests=true clean compile
```

2) Reload VS Code Java language server:
- Open Command Palette (Ctrl+Shift+P)
- Run: `Java: Clean the Java language server workspace`
- After the cleanup completes, run: `Developer: Reload Window`

3) Ensure VS Code points to a proper JDK 17 runtime (adjust path):
- Create or update `.vscode/settings.json` with a runtime entry like the example below.

Example `.vscode/settings.json` (replace `path` with your JDK 17 installation path):

```json
{
  "java.configuration.runtimes": [
    {
      "name": "JavaSE-17",
      "path": "C:/Program Files/Java/jdk-17",
      "default": true
    }
  ]
}
```

4) If problems persist, refresh Maven projects:
- Command Palette -> `Maven: Update Project` or run:

```bash
mvn -U -DskipTests=true compile
```

5) Final verification:
- Run the app and check logs:

```bash
mvn spring-boot:run
```

If you want, I can create a `.vscode/settings.json` file for you with the example content — you'll need to edit the `path` to match your JDK installation before reloading VS Code. Let me know if you want me to add that file now.
