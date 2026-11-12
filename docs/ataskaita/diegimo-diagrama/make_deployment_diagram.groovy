// Sukuria AbsoluteCinema UML diegimo diagramą Magic Systems of Systems Architect (MSoSA) programoje.
// Paleidžiama batch režimu (be naudotojo veiksmų): naujas projektas → modelis → diagrama → SVG/PNG → .mdzip
//
// Paleidimas (Git Bash, MSoSA turi būti uždarytas):
//   cd "/c/Program Files/Magic Systems of Systems Architect"
//   env -u _JAVA_OPTIONS jre/bin/java -Xmx4000M -Xss1024K \
//     -cp "lib/classpath.jar;plugins/com.nomagic.magicdraw.automaton/lib/groovy-5.0.0.jar" \
//     -Desi.system.config=data/application.conf -Dfile.encoding=UTF-8 @bin/vm.options \
//     groovy.ui.GroovyMain --encoding=UTF-8 C:/saitynai/docs/ataskaita/diegimo-diagrama/make_deployment_diagram.groovy \
//     out=C:/saitynai/docs/ataskaita/diegimo-diagrama
//
// Sukurtą .mdzip galima atidaryti MSoSA (File → Open Project) ir toliau redaguoti ranka.
import com.nomagic.magicdraw.commandline.CommandLine
import com.nomagic.magicdraw.core.Application
import com.nomagic.magicdraw.core.project.ProjectDescriptorsFactory
import com.nomagic.magicdraw.export.image.ImageExporter
import com.nomagic.magicdraw.openapi.uml.ModelElementsManager
import com.nomagic.magicdraw.openapi.uml.PresentationElementsManager
import com.nomagic.magicdraw.openapi.uml.SessionManager
import com.nomagic.magicdraw.properties.BooleanProperty
import com.nomagic.magicdraw.properties.PropertyID
import com.nomagic.magicdraw.properties.PropertyManager
import com.nomagic.magicdraw.uml.DiagramTypeConstants
import com.nomagic.uml2.ext.jmi.helpers.ModelHelper

import java.awt.Rectangle

class DeploymentDiagram extends CommandLine {
    static File outDir

    @Override
    protected void parseArgs(String[] args) {
        def out = args.find { it.startsWith('out=') }
        outDir = new File(out.substring(4))
        outDir.mkdirs()
    }

    @Override
    protected byte execute() {
        def pm = Application.getInstance().getProjectsManager()
        def project = pm.createProject()
        def ef = project.getElementsFactory()
        def mem = ModelElementsManager.getInstance()
        def pem = PresentationElementsManager.getInstance()
        def sm = SessionManager.getInstance()
        def dpe

        sm.createSession(project, 'AbsoluteCinema diegimo diagrama')
        try {
            def pkg = ef.createPackageInstance()
            pkg.setName('AbsoluteCinema diegimas')
            mem.addElement(pkg, project.getPrimaryModel())

            // ---------- modelio elementai ----------
            def device = { String name ->
                def d = ef.createDeviceInstance(); d.setName(name); mem.addElement(d, pkg); d
            }
            def environment = { owner, String name ->
                def e = ef.createExecutionEnvironmentInstance(); e.setName(name); mem.addElement(e, owner); e
            }
            def artifact = { String name ->
                def a = ef.createArtifactInstance(); a.setName(name); mem.addElement(a, pkg); a
            }
            // Deployment: artefaktas įdiegtas vykdymo aplinkoje (location = vykdymo aplinka)
            def deploy = { art, target ->
                def d = ef.createDeploymentInstance(); d.setLocation(target); d.getDeployedArtifact().add(art); d
            }
            def communication = { a, b, String name ->
                def p = ef.createCommunicationPathInstance()
                p.setName(name)
                mem.addElement(p, pkg)
                ModelHelper.setClientElement(p, a)
                ModelHelper.setSupplierElement(p, b)
                p
            }

            def computer = device('Naudotojo kompiuteris')
            def browser = environment(computer, 'Žiniatinklio naršyklė')
            def spa = artifact('React SPA')

            def render = device('Render debesų platforma')
            def caddy = environment(render, 'Caddy 2 (frontend web servisas)')
            def franken = environment(render, 'FrankenPHP, PHP 8.4 (API web servisas)')
            def postgres = environment(render, 'PostgreSQL 17 (Render duomenų bazė)')
            def dist = artifact('frontend/dist')
            def api = artifact('AbsoluteCinema API')
            def db = artifact('absolutecinema')

            deploy(spa, browser)
            deploy(dist, caddy)
            deploy(api, franken)
            deploy(db, postgres)

            // Nemokamas Render web servisas negali priimti srauto privačiu tinklu,
            // todėl Caddy kreipiasi į API per viešą HTTPS adresą; į DB API jungiasi privačiu tinklu
            def https = communication(browser, caddy, 'HTTPS')
            def proxy = communication(caddy, franken, 'HTTPS, viešas API adresas (/api)')
            def orm = communication(franken, postgres, 'TCP 5432, privatus tinklas (Eloquent ORM)')

            // ---------- diagrama ----------
            def diagram = mem.createDiagram(DiagramTypeConstants.UML_DEPLOYMENT_DIAGRAM, pkg)
            diagram.setName('AbsoluteCinema diegimo diagrama')
            dpe = project.getDiagram(diagram)
            dpe.open()

            // Kiekvienas simbolis sukuriamas iškart savo vietoje (kitaip MSoSA išdidina tėvinį simbolį),
            // be automatiškai pridedamų ryšių (false), su išjungtu automatiniu dydžiu (autosize)
            def layout = []
            def shape = { element, parent, int x, int y, int w, int h ->
                def s = pem.createShapeElement(element, parent, false, new java.awt.Point(x, y))
                def props = new PropertyManager()
                props.addProperty(new BooleanProperty(PropertyID.AUTOSIZE, false))
                pem.setPresentationElementProperties(s, props)
                def r = new Rectangle(x, y, w, h)
                pem.reshapeShapeElement(s, r)
                layout << [s, r]
                s
            }

            def computerShape = shape(computer, dpe, 20, 40, 290, 250)
            def browserShape = shape(browser, computerShape, 40, 100, 250, 170)
            shape(spa, browserShape, 70, 170, 190, 70)

            def renderShape = shape(render, dpe, 420, 20, 560, 640)
            def caddyShape = shape(caddy, renderShape, 450, 80, 500, 150)
            shape(dist, caddyShape, 720, 130, 200, 70)
            def frankenShape = shape(franken, renderShape, 450, 290, 500, 150)
            shape(api, frankenShape, 720, 340, 200, 70)
            def postgresShape = shape(postgres, renderShape, 450, 500, 500, 140)
            shape(db, postgresShape, 720, 545, 200, 70)

            // Antras praėjimas: dar kartą pritaikome koordinates (tėvai pirmiau už vaikus),
            // nes kuriant vaikinį simbolį MSoSA gali pakeisti tėvo dydį
            layout.each { s, r -> pem.reshapeShapeElement(s, r) }

            pem.createPathElement(https, browserShape, caddyShape)
            pem.createPathElement(proxy, caddyShape, frankenShape)
            pem.createPathElement(orm, frankenShape, postgresShape)
        } finally {
            sm.closeSession(project)
        }

        ImageExporter.export(dpe, ImageExporter.SVG, new File(outDir, 'diegimo-diagrama.svg'))
        ImageExporter.export(dpe, ImageExporter.PNG, new File(outDir, 'diegimo-diagrama.png'))

        def file = new File(outDir, 'AbsoluteCinema_diegimo_diagrama.mdzip')
        def saved = pm.saveProject(ProjectDescriptorsFactory.createLocalProjectDescriptor(project, file), true)
        printToCommandLineConsole("saved=${saved} -> ${file}")
        pm.closeProjectNoSave()
        return 0
    }
}

new DeploymentDiagram().launch(args as String[])
