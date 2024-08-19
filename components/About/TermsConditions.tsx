import React from 'react'
import { Anchor, Badge, Card, Flex, Group, Image, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import Env from 'utils/config/Env'
import Theme from 'src/app/theme'

const TermsConditions = () => {
  const isTablet = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)
  const isPhone = useMediaQuery(`(max-width: ${Theme.breakpoints?.sm})`)

  return (
    <Card
      id="termsConditions"
      shadow="sm"
      my="4rem"
      mx={isPhone ? '2rem' : isTablet ? '3rem' : '20%'}
      p="lg"
      radius="md"
      withBorder>
      <Card.Section p="1rem">
        <Flex justify="center">
          <Image
            src="/android-chrome-512x512.png"
            h="200"
            w="auto"
            alt="Universiteams logo"
            p="rem"
            radius="md"
          />
        </Flex>
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text size="xl">Términos y Condiciones</Text>
        <Badge color="pink">Info legal</Badge>
      </Group>

      <Card.Section p="1rem">
        <Group justify="space-between" mt="md" mb="xs">
          <Text size="lg">Universiteams - Términos y Condiciones</Text>
          <Badge color="orange.8">Última actualización: 18/08/2024</Badge>
        </Group>
        <Text size="sm" c="dimmed">
          ¡Bienvenido a Universiteams! Estos Términos y Condiciones (&quot;Términos&quot;) rigen el
          uso de la Aplicación Universiteams (&quot;Aplicación&quot;), propiedad y operada por
          &quot;Team120&quot; (Organización de GitHub). Al acceder o usar la Aplicación, usted
          acepta estar sujeto a estos Términos. Si no acepta estos Términos, no podrá usar la
          Aplicación.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">1. Aceptación de los Términos</Text>
        <Text size="sm" c="dimmed">
          Al registrarse, acceder o utilizar la Aplicación, usted reconoce que ha leído, comprendido
          y acepta estar sujeto a estos Términos y todas las leyes y regulaciones aplicables.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">2. Requisitos de elegibilidad</Text>
        <Text size="sm" c="dimmed">
          Para utilizar Universiteams, debes ser estudiante, miembro del cuerpo docente o estar
          afiliado a una universidad o institución educativa. Al utilizar la Aplicación, declaras y
          garantizas que cumples con estos requisitos de elegibilidad.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">3. Registro de la cuenta</Text>
        <Text size="sm" c="dimmed">
          Para acceder a ciertas funciones de la Aplicación, es posible que se te solicite que crees
          una cuenta. Aceptas proporcionar información precisa, actual y completa durante el proceso
          de registro y actualizar dicha información para mantenerla precisa, actual y completa.
          Eres responsable de proteger las credenciales de tu cuenta y de todas las actividades que
          se realicen en ella.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">4. Uso de la Aplicación</Text>
        <Text size="sm" c="dimmed">
          - Creación de proyectos: los usuarios pueden crear y gestionar proyectos relacionados con
          la universidad. Usted es responsable del contenido y la precisión de la información del
          proyecto que proporcione.
        </Text>
        <Text size="sm" c="dimmed">
          - Búsqueda de proyectos: los usuarios pueden buscar proyectos universitarios.
          Universiteams no garantiza la disponibilidad, calidad o relevancia de los proyectos
          incluidos en la Aplicación.
        </Text>
        <Text size="sm" c="dimmed">
          - Inscripción en proyectos: los usuarios pueden solicitar unirse a los proyectos incluidos
          en la Aplicación. La aceptación en un proyecto queda a criterio exclusivo del creador o
          administrador del proyecto.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">5. Conducta del usuario</Text>
        <Text size="sm" c="dimmed">
          Usted acepta utilizar la Aplicación únicamente con fines lícitos. Tiene prohibido:
        </Text>
        <Text size="sm" c="dimmed">
          - Publicar contenido falso, engañoso o inapropiado.
        </Text>
        <Text size="sm" c="dimmed">
          - Suplantar la identidad de otra persona o entidad.
        </Text>
        <Text size="sm" c="dimmed">
          - Participar en cualquier actividad que pueda interrumpir o interferir con la
          funcionalidad de la Aplicación.
        </Text>
        <Text size="sm" c="dimmed">
          - Recopilar datos personales de otros usuarios sin su consentimiento.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">6. Propiedad y licencia del contenido</Text>
        <Text size="sm" c="dimmed">
          - Contenido del usuario: Usted conserva la propiedad de cualquier contenido que envíe,
          publique o muestre en la Aplicación. Al publicar contenido, usted otorga a Universiteams
          una licencia no exclusiva, mundial y libre de regalías para usar, mostrar y distribuir su
          contenido en la Aplicación.
        </Text>
        <Text size="sm" c="dimmed">
          - Contenido de la Aplicación: Todo el resto del contenido proporcionado en la Aplicación,
          incluidos textos, gráficos, logotipos y software, es propiedad de Universiteams o sus
          licenciantes y está protegido por las leyes de propiedad intelectual.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">7. Política de privacidad</Text>
        <Text size="sm" c="dimmed">
          En Universiteams, valoramos su privacidad. Recopilamos información personal como su
          nombre, dirección de correo electrónico y afiliación universitaria cuando crea una cuenta,
          así como datos sobre cómo utiliza la Aplicación. Esta información nos ayuda a administrar
          su cuenta, facilitar la participación en proyectos y mejorar nuestros servicios. También
          recopilamos información del dispositivo, como su dirección IP, para mejorar su
          experiencia.
        </Text>
        <Text size="sm" c="dimmed">
          Podemos compartir su información con otros usuarios cuando participe en proyectos y con
          proveedores de servicios de confianza que nos ayudan a operar la Aplicación. Sus datos
          también pueden divulgarse si así lo exige la ley. Nos tomamos la seguridad en serio y
          utilizamos medidas para proteger su información, aunque ningún sistema es completamente
          seguro.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">8. Terminación </Text>
        <Text size="sm" c="dimmed">
          Universiteams se reserva el derecho de suspender o cancelar su cuenta o acceso a la
          Aplicación en cualquier momento, con o sin motivo, y con o sin previo aviso.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">9. Descargo de responsabilidad</Text>
        <Text size="sm" c="dimmed">
          - La Aplicación se proporciona &quot;tal como está&quot; y &quot;según
          disponibilidad&quot;. Universiteams no ofrece garantías, expresas o implícitas, con
          respecto al funcionamiento, la disponibilidad o el contenido de la Aplicación.
        </Text>
        <Text size="sm" c="dimmed">
          - Universiteams no es responsable de las acciones o el contenido de los usuarios o
          terceros en la Aplicación.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">10. Limitación de responsabilidad</Text>
        <Text size="sm" c="dimmed">
          En la medida máxima permitida por la ley, Universiteams no será responsable de ningún daño
          directo, indirecto, incidental, especial o consecuente que surja de o en relación con su
          uso de la Aplicación.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">11. Indemnización</Text>
        <Text size="sm" c="dimmed">
          Usted acepta indemnizar y eximir de responsabilidad a Universiteams, sus afiliados y sus
          respectivos funcionarios, directores, empleados y agentes de cualquier reclamo,
          responsabilidad, daño o gasto que surja de su uso de la Aplicación o de la violación de
          estos Términos.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">12. Ley aplicable</Text>
        <Text size="sm" c="dimmed">
          Estos Términos se rigen por las leyes de Argentina y se interpretan de conformidad con
          ellas, sin tener en cuenta sus principios de conflicto de leyes.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">13. Cambios en los Términos</Text>
        <Text size="sm" c="dimmed">
          Universiteams se reserva el derecho de modificar estos Términos en cualquier momento. Le
          notificaremos cualquier cambio mediante la publicación de los Términos actualizados en la
          Aplicación. El uso continuo de la Aplicación después de cualquier cambio constituye su
          aceptación de los nuevos Términos.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">14. Información de contacto</Text>
        <Text size="sm" c="dimmed">
          Si tiene alguna pregunta o inquietud sobre estos Términos, comuníquese con nosotros a{' '}
          <Anchor
            href={`mailto:${Env.contactMail}`}
            target="_blank"
            underline="hover"
            style={{ color: '#fd7e14' }}>
            {Env.contactMail}
          </Anchor>
          .
        </Text>
      </Card.Section>
    </Card>
  )
}

export default TermsConditions
